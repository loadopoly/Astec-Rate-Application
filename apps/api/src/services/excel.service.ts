/**
 * Excel Import Service
 *
 * Parses an uploaded Excel workbook and upserts records into the database.
 * Supports a flexible column-mapping strategy so variations in column
 * naming across different versions of the spreadsheet all work correctly.
 *
 * The real Excel sheet has multiple rows per REQUEST NUMBER — one per
 * carrier bid.  The first row of each group contains the quote-level
 * details (margin, status, selected carrier info, ratings); subsequent
 * rows add carrier bids.
 *
 * On the **very first import** (no prior ImportLog records), the service
 * automatically purges all seed / mock data from the database so that
 * the real data replaces it cleanly.
 *
 * Expected sheet layout (any sheet name is accepted, first sheet used):
 *   Row 1  — header row with column names
 *   Row 2+ — data rows
 *
 * Recognised columns (case-insensitive, spaces/underscores/hyphens ignored):
 *   B/F, REQUEST NUMBER, REQUEST DATE, JOB, CUSTOMER,
 *   ORIGIN CITY, ORIGIN ST, DESTINATION CITY, DESTINATION ST,
 *   Qty FLATBED, Qty STEP DECK, Qty DOUBLE, Qty TOWAWAY, Qty DOLLY, Qty RGN,
 *   MISC. LOAD OR CHARGES, CARRIER, LIVE-LOAD, QUOTE TOTAL, COST,
 *   MARK-UP, QUOTE TDW, IS YOUR ..., CUSTOMER QUOTE, VOICED/INVOICED,
 *   SELECTED, carrier (selected), CARRIER RATE, MARGINAL MARGIN,
 *   RIGHT EQUIP, CUSTOMER RESPONSE, ON-TIME, TE/INVOICE, CLAIMS, RATING
 */

import ExcelJS from 'exceljs';
import db from '../lib/db';
import { QuoteStatus, QuoteType, CarrierType } from '@prisma/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImportResult {
  filename:       string;
  recordsTotal:   number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsFailed:  number;
  errors:         string[];
}

interface RowData {
  quoteType?:     string;   // B/F → Budget or Firm
  requestNumber?: string;
  quoteDate?:     string;
  jobId?:         string;
  customer?:      string;
  originCity?:    string;
  originState?:   string;
  destCity?:      string;
  destState?:     string;
  // Equipment quantities
  qtyFlatbed?:    string;
  qtyStepDeck?:   string;
  qtyDouble?:     string;
  qtyTowaway?:    string;
  qtyDolly?:      string;
  qtyRgn?:        string;
  // Charges & rates
  miscCharges?:   string;
  carrier?:       string;   // bidding carrier name (per-row)
  liveLoad?:      string;
  rate?:          string;   // quote total
  cost?:          string;   // carrier cost
  baseRate?:      string;
  fuelSurcharge?: string;
  accessorials?:  string;
  lbs?:           string;
  miles?:         string;
  margin?:        string;
  status?:        string;
  quoteResult?:   string;   // BETTER THAN TARGET, etc.
  isYourQuote?:   string;
  customerQuote?: string;
  invoiced?:      string;
  selected?:      string;   // Y/N — was this carrier selected?
  selectedCarrier?: string; // name of the carrier that was selected
  carrierRate?:   string;
  marginalMargin?: string;
  // Ratings (1-5)
  equipRating?:   string;
  responseRating?: string;
  serviceRating?: string;
  accuracyRating?: string;
  claims?:        string;
  overallRating?: string;
  notes?:         string;
  mcNumber?:      string;
  equipment?:     string;   // legacy single-column equipment
}

// ---------------------------------------------------------------------------
// Column name normalisation & mapping
// ---------------------------------------------------------------------------

/** Strip spaces, underscores, hyphens, dots, colons and lower-case */
function norm(s: string): string {
  return String(s ?? '').toLowerCase().replace(/[\s_.#:/-]/g, '');
}

const COL_MAP: Array<{ keys: string[]; field: keyof RowData }> = [
  // Quote type (B/F)
  { keys: ['bf', 'budgetfirm', 'budgetorfirm', 'type'],                                                   field: 'quoteType'      },

  // Request / Quote identifiers
  { keys: ['requestnumber', 'requestno', 'requestnum', 'quote', 'quoteno', 'quotenum', 'quoteid', 'id'],   field: 'requestNumber'  },
  { keys: ['requestdate', 'date', 'quotedate', 'shipdate', 'orderdate'],                                   field: 'quoteDate'      },
  { keys: ['job', 'jobid', 'jobno', 'jobnum'],                                                             field: 'jobId'          },
  { keys: ['customer', 'customername', 'client'],                                                           field: 'customer'       },

  // Origin
  { keys: ['origincity',  'origcity',  'fromcity'],                                                        field: 'originCity'     },
  { keys: ['originst',    'originstate', 'origstate', 'fromstate', 'fromst'],                               field: 'originState'    },
  { keys: ['origin',      'from', 'originlocation'],                                                       field: 'originCity'     },  // combined "City, ST"

  // Destination
  { keys: ['destinationcity', 'destcity', 'tocity', 'shipcity'],                                            field: 'destCity'       },
  { keys: ['destinationst',   'deststate', 'destinationstate', 'tostate', 'shipstate', 'destst'],           field: 'destState'      },
  { keys: ['destination', 'dest', 'to', 'destinationlocation'],                                            field: 'destCity'       },  // combined

  // Equipment quantities
  { keys: ['qtyflatbed',   'flatbed'],                                                                      field: 'qtyFlatbed'     },
  { keys: ['qtystepdeck',  'stepdeck', 'stepdeckqty'],                                                     field: 'qtyStepDeck'    },
  { keys: ['qtydouble',    'double', 'doubledeck'],                                                        field: 'qtyDouble'      },
  { keys: ['qtytowaway',   'towaway', 'toway'],                                                            field: 'qtyTowaway'     },
  { keys: ['qtydolly',     'dolly'],                                                                        field: 'qtyDolly'       },
  { keys: ['qtyrgn',       'rgn'],                                                                          field: 'qtyRgn'         },

  // Charges & rates
  { keys: ['miscloadcharges', 'miscloadorcharges', 'misccharges', 'miscload'],                              field: 'miscCharges'    },
  { keys: ['carrier', 'carriername', 'vendor'],                                                             field: 'carrier'        },
  { keys: ['liveload', 'liveloadcost', 'liveloadlist'],                                                    field: 'liveLoad'       },
  { keys: ['quotetotal', 'total', 'rate', 'totalrate', 'quoteamount', 'quotetocustomer', 'customerrate', 'amount'], field: 'rate'    },
  { keys: ['cost', 'carriercost', 'totalcost'],                                                            field: 'cost'           },
  { keys: ['baserate', 'linehaul', 'linehaulrate', 'baseamount'],                                          field: 'baseRate'       },
  { keys: ['fuelsurcharge', 'fuel', 'fsc'],                                                                field: 'fuelSurcharge'  },
  { keys: ['accessorials', 'accessorial', 'other', 'fees'],                                                field: 'accessorials'   },
  { keys: ['lbs', 'weight', 'weightlbs'],                                                                  field: 'lbs'            },
  { keys: ['miles', 'distance', 'milesdriven'],                                                            field: 'miles'          },
  { keys: ['markup', 'markupto', 'markuponto', 'margin', 'marginpct', 'marginpercent', 'grossmargin'],     field: 'margin'         },

  // Status & outcome
  { keys: ['status', 'quotestatus', 'result'],                                                             field: 'status'         },
  { keys: ['quotetdw', 'quoteresult', 'quotetarget', 'betterthan'],                                       field: 'quoteResult'    },
  { keys: ['isyour', 'isyourquote'],                                                                       field: 'isYourQuote'    },
  { keys: ['customerquote'],                                                                                field: 'customerQuote'  },
  { keys: ['voicedinvoiced', 'invoiced', 'voiced'],                                                        field: 'invoiced'       },
  { keys: ['selected', 'wasselected'],                                                                     field: 'selected'       },
  { keys: ['selectedcarrier', 'selectedcarriername'],                                                       field: 'selectedCarrier'},
  { keys: ['carrierrate', 'carriermarginalrate', 'ratereceipt'],                                           field: 'carrierRate'    },
  { keys: ['marginalmargin'],                                                                               field: 'marginalMargin' },

  // Carrier ratings (1-5 scale)
  { keys: ['rightequip', 'rightequipment', 'rightequiptohandle', 'equipmentrating'],                       field: 'equipRating'    },
  { keys: ['customerresponse', 'customerrespon', 'responserating'],                                        field: 'responseRating' },
  { keys: ['quickservice', 'ontime', 'quickserviceontime', 'servicerating'],                               field: 'serviceRating'  },
  { keys: ['teinvoice', 'teinvoiceandaccuracy', 'teinvoiceandacura', 'accuracyrating'],                   field: 'accuracyRating' },
  { keys: ['anyclaims', 'claims'],                                                                         field: 'claims'         },
  { keys: ['frailrating', 'overallrating', 'finalrating', 'rating'],                                      field: 'overallRating'  },

  // Notes / other
  { keys: ['notes', 'note', 'comments', 'comment', 'scomm'],                                              field: 'notes'          },
  { keys: ['mc', 'mcnumber', 'mcno', 'carriermcno'],                                                      field: 'mcNumber'       },
  { keys: ['equipment', 'equiptype', 'equipmenttype', 'trailer', 'trailertype'],                           field: 'equipment'      },
];

function buildColumnMap(headers: (string | undefined)[]): Map<number, keyof RowData> {
  const result = new Map<number, keyof RowData>();
  const usedFields = new Set<keyof RowData>();
  headers.forEach((h, i) => {
    if (!h) return;
    const n = norm(h);
    for (const { keys, field } of COL_MAP) {
      if (usedFields.has(field)) continue;
      if (keys.some((k) => n === k || n.startsWith(k))) {
        result.set(i, field);
        usedFields.add(field);
        break;
      }
    }
  });
  return result;
}

// ---------------------------------------------------------------------------
// Value helpers
// ---------------------------------------------------------------------------

function cellStr(cell: ExcelJS.Cell): string {
  const v = cell.value;
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') {
    if ('richText' in v) {
      // CellRichTextValue
      return (v as ExcelJS.CellRichTextValue).richText.map((r) => r.text).join('');
    }
    if ('result' in v) {
      // CellFormulaValue
      const result = (v as ExcelJS.CellFormulaValue).result;
      return result != null ? String(result) : '';
    }
    if ('hyperlink' in v) {
      // CellHyperlinkValue
      return String((v as ExcelJS.CellHyperlinkValue).text ?? '');
    }
    if ('error' in v) return '';
  }
  return String(v);
}

function parseNum(s: string): number {
  return parseFloat(s.replace(/[$,%\s,]/g, '')) || 0;
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function mapStatus(s: string): QuoteStatus {
  const n = norm(s);
  if (n.includes('won') || n.includes('closed') || n.includes('awarded')) return QuoteStatus.CLOSED;
  if (n.includes('lost') || n.includes('lostsale'))                        return QuoteStatus.LOST_SALE;
  if (n.includes('approved') || n.includes('quoted') || n.includes('firm')) return QuoteStatus.QUOTED;
  if (n.includes('signed') || n.includes('contract'))                       return QuoteStatus.SIGNED_CONTRACT;
  if (n.includes('customer') || n.includes('arranged'))                     return QuoteStatus.CUSTOMER_ARRANGED;
  return QuoteStatus.PENDING;
}

function mapQuoteType(s: string): QuoteType {
  const n = norm(s);
  if (n.includes('budget') || n === 'b') return QuoteType.BUDGET;
  return QuoteType.FIRM;
}

/** Split "City, ST" into { city, state } — handles optional zip too */
function splitCityState(s: string): { city: string; state: string } | null {
  const parts = s.split(',').map((p) => p.trim());
  if (parts.length < 2) return null;
  return { city: parts[0], state: parts[1].split(' ')[0] };
}

// ---------------------------------------------------------------------------
// Upsert helpers (shared logic)
// ---------------------------------------------------------------------------

async function getOrCreateCarrier(name: string, mcNumber?: string) {
  if (mcNumber) {
    const existing = await db.carrier.findUnique({ where: { mcNumber } });
    if (existing) return existing;
  }
  if (name) {
    const existing = await db.carrier.findUnique({ where: { name } });
    if (existing) {
      if (mcNumber && !existing.mcNumber) {
        return db.carrier.update({ where: { id: existing.id }, data: { mcNumber } });
      }
      return existing;
    }
  }
  // Create new carrier; default to asset-based CARRIER type.
  // The carrier type can be updated later once more details are available.
  return db.carrier.create({
    data: {
      name:         name || `Carrier ${mcNumber}`,
      mcNumber:     mcNumber || null,
      type:         CarrierType.CARRIER,
      isAssetBased: true,
      isBroker:     false,
    },
  });
}

async function upsertLocation(city: string, state: string) {
  return db.location.upsert({
    where:  { city_state: { city, state } },
    update: {},
    create: { city, state },
  });
}

async function upsertLane(originId: string, destId: string, distance?: number) {
  return db.lane.upsert({
    where:  { originId_destId: { originId, destId } },
    update: distance != null ? { distance } : {},
    create: { originId, destId, distance: distance || null },
  });
}

/** Return the first active site — for imports we default to the primary site */
async function getDefaultSite() {
  const site = await db.site.findFirst({ where: { isActive: true } });
  if (!site) throw new Error('No active site found — run seed first.');
  return site;
}

// ---------------------------------------------------------------------------
// Purge seed / mock data (runs once before the first real import)
// ---------------------------------------------------------------------------

/**
 * Delete all non-essential data in the correct FK order so the database
 * is clean before the first real import replaces the seed data.
 */
async function purgeExistingData(): Promise<void> {
  /* eslint-disable no-console */
  console.log('🧹  First import detected — purging mock / seed data …');
  // Delete in FK dependency order (children first)
  await db.bid.deleteMany({});
  await db.quote.deleteMany({});
  await db.carrierPerformance.deleteMany({});
  await db.carrierContact.deleteMany({});
  await db.carrierSite.deleteMany({});
  await db.carrier.deleteMany({});
  await db.laneMetric.deleteMany({});
  await db.lane.deleteMany({});
  await db.location.deleteMany({});
  console.log('   ✓ Seed data purged.');
  /* eslint-enable no-console */
}

// ---------------------------------------------------------------------------
// Row processor — handles one row from the spreadsheet
// ---------------------------------------------------------------------------

async function processRow(
  row:     RowData,
  siteId:  string,
  errors:  string[],
  rowNum:  number,
): Promise<'created' | 'updated' | 'skipped'> {
  // Resolve locations
  let originCity  = row.originCity  ?? '';
  let originState = row.originState ?? '';
  let destCity    = row.destCity    ?? '';
  let destState   = row.destState   ?? '';

  // If origin/dest arrived as combined "City, ST" strings, split them
  if (originCity.includes(',')) {
    const split = splitCityState(originCity);
    if (split) { originCity = split.city; originState = split.state; }
  }
  if (destCity.includes(',')) {
    const split = splitCityState(destCity);
    if (split) { destCity = split.city; destState = split.state; }
  }

  if (!originCity || !destCity) {
    errors.push(`Row ${rowNum}: missing origin/destination city`);
    return 'skipped';
  }

  const origin = await upsertLocation(originCity, originState || '');
  const dest   = await upsertLocation(destCity,   destState   || '');
  const miles  = parseNum(row.miles ?? '');
  const lane   = await upsertLane(origin.id, dest.id, miles || undefined);

  // Carrier (per-row bidding carrier)
  let carrierId: string | null = null;
  if (row.carrier || row.mcNumber) {
    const carrier = await getOrCreateCarrier(row.carrier ?? '', row.mcNumber);
    carrierId = carrier.id;
  }

  // Selected carrier (may differ from the per-row carrier)
  let selectedCarrierId: string | null = null;
  if (row.selectedCarrier) {
    const selCarrier = await getOrCreateCarrier(row.selectedCarrier);
    selectedCarrierId = selCarrier.id;
  } else if (row.selected && norm(row.selected) === 'y' && carrierId) {
    // This row's carrier was the selected one
    selectedCarrierId = carrierId;
  }

  // Rates
  const quoteToCustomer = parseNum(row.rate ?? '');
  const carrierCost     = parseNum(row.cost ?? '');
  const marginPct       = row.margin ? parseNum(row.margin) / 100 : 0;
  const carrierTotal    = carrierCost > 0
    ? carrierCost
    : Math.round(quoteToCustomer * (1 - marginPct) * 100) / 100;

  const quoteDate = parseDate(row.quoteDate ?? '') ?? new Date();
  const requestNumber = row.requestNumber?.trim();

  if (!requestNumber) {
    errors.push(`Row ${rowNum}: missing quote/request number — row skipped`);
    return 'skipped';
  }

  const status = mapStatus(row.status ?? '');
  const type   = mapQuoteType(row.quoteType ?? 'firm');

  // Equipment quantities
  const flatbedQty   = parseInt(row.qtyFlatbed  ?? '0', 10) || 0;
  const stepDeckQty  = parseInt(row.qtyStepDeck ?? '0', 10) || 0;
  const doubleDeckQty = parseInt(row.qtyDouble  ?? '0', 10) || 0;
  const towawayQty   = parseInt(row.qtyTowaway  ?? '0', 10) || 0;
  const dollyQty     = parseInt(row.qtyDolly    ?? '0', 10) || 0;
  const rgnQty       = parseInt(row.qtyRgn      ?? '0', 10) || 0;

  const liveLoadCost = parseNum(row.liveLoad ?? '');
  const miscCharges  = parseNum(row.miscCharges ?? '');

  const quoteData = {
    type,
    status,
    jobId:             row.jobId?.trim()   || requestNumber,
    customer:          row.customer?.trim() || 'Unknown',
    laneId:            lane.id,
    siteId,
    quoteToCustomer,
    carrierTotal,
    markup:            marginPct,
    quoteDate,
    selectedCarrierId,
    notes:             row.notes?.trim() || null,
    quoteResult:       row.quoteResult?.trim() || null,
    liveLoadCost,
    flatbedQty,
    stepDeckQty,
    doubleDeckQty,
    towawayQty,
    dollyQty,
    rgnQty,
    // Store misc charges in accessorials/listQuote for now
    listQuote:         miscCharges,
  };

  const existing = await db.quote.findUnique({ where: { requestNumber } });

  let quoteId: string;
  let outcome: 'created' | 'updated';

  if (existing) {
    await db.quote.update({ where: { requestNumber }, data: quoteData });
    quoteId = existing.id;
    outcome = 'updated';
  } else {
    const created = await db.quote.create({ data: { requestNumber, ...quoteData } });
    quoteId = created.id;
    outcome = 'created';
  }

  // ----- Carrier Bid (one per row) -----
  if (carrierId) {
    const bidAmount = parseNum(row.carrierRate ?? row.cost ?? row.rate ?? '');
    const isSelected = selectedCarrierId === carrierId
      || (row.selected ? norm(row.selected) === 'y' : false);

    // Ratings from the spreadsheet (1-5 scale)
    const equipRating    = parseInt(row.equipRating    ?? '', 10) || null;
    const responseRating = parseInt(row.responseRating ?? '', 10) || null;
    const serviceRating  = parseInt(row.serviceRating  ?? '', 10) || null;

    await db.bid.upsert({
      where:  { quoteId_carrierId: { quoteId, carrierId } },
      update: {
        totalRate:       bidAmount,
        isSelected,
        equipmentRating: equipRating,
        responseRating,
        serviceRating,
      },
      create: {
        quoteId,
        carrierId,
        totalRate:       bidAmount,
        isSelected,
        equipmentRating: equipRating,
        responseRating,
        serviceRating,
      },
    });
  }

  return outcome;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function importExcelFile(
  buffer:      Buffer,
  filename:    string,
  importedBy:  string,
): Promise<ImportResult> {
  const workbook = new ExcelJS.Workbook();
  // ExcelJS's load() expects a Node.js Buffer; cast away the generic type parameter
  // that TypeScript adds in newer @types/node versions.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await workbook.xlsx.load(buffer as any);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('Excel file contains no worksheets');
  }

  // Read header row (row 1)
  const headerRow = worksheet.getRow(1);
  const headers: (string | undefined)[] = [];
  headerRow.eachCell({ includeEmpty: true }, (cell: ExcelJS.Cell, colNum: number) => {
    headers[colNum] = cellStr(cell) || undefined;
  });

  const colMap = buildColumnMap(headers);

  if (colMap.size === 0) {
    throw new Error('Could not recognise any column headers in the first row of the spreadsheet');
  }

  // ---------------------------------------------------------------
  // On the FIRST import, purge all seed / mock data so the database
  // transitions cleanly to real data.
  // ---------------------------------------------------------------
  const priorImportCount = await db.importLog.count();
  if (priorImportCount === 0) {
    await purgeExistingData();
  }

  const site = await getDefaultSite();

  const result: ImportResult = {
    filename,
    recordsTotal:   0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsFailed:  0,
    errors:         [],
  };

  const rowCount = worksheet.rowCount;

  for (let rowNum = 2; rowNum <= rowCount; rowNum++) {
    const row = worksheet.getRow(rowNum);

    // Skip completely empty rows
    let hasData = false;
    row.eachCell({ includeEmpty: false }, () => { hasData = true; });
    if (!hasData) continue;

    result.recordsTotal++;

    // Extract values using column map
    const rowData: RowData = {};
    colMap.forEach((field, colIdx) => {
      const cell = row.getCell(colIdx);
      const val  = cellStr(cell).trim();
      if (val) (rowData as Record<string, string>)[field] = val;
    });

    try {
      const outcome = await processRow(rowData, site.id, result.errors, rowNum);
      if (outcome === 'created') result.recordsCreated++;
      else if (outcome === 'updated') result.recordsUpdated++;
      else result.recordsFailed++;
    } catch (err) {
      result.recordsFailed++;
      result.errors.push(`Row ${rowNum}: ${(err as Error).message}`);
    }
  }

  // Log the import
  await db.importLog.create({
    data: {
      filename,
      fileType:       'EXCEL',
      recordsTotal:   result.recordsTotal,
      recordsCreated: result.recordsCreated,
      recordsUpdated: result.recordsUpdated,
      recordsFailed:  result.recordsFailed,
      errors:         result.errors.length > 0 ? result.errors : undefined,
      importedBy,
    },
  });

  return result;
}
