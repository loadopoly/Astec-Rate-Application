/**
 * Excel Import Service
 *
 * Parses an uploaded Excel workbook and upserts records into the database.
 * Supports a flexible column-mapping strategy so variations in column
 * naming across different versions of the spreadsheet all work correctly.
 *
 * Expected sheet layout (any sheet name is accepted, first sheet used):
 *   Row 1  — header row with column names
 *   Row 2+ — data rows
 *
 * Required columns (case-insensitive, spaces/underscores/hyphens ignored):
 *   quote #, date, origin city, origin state, dest city, dest state,
 *   equipment, rate / quote amount, carrier, mc #
 *
 * Optional columns:
 *   base rate, fuel surcharge, accessorials, lbs, miles, margin,
 *   status, notes, customer, job #
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
  requestNumber?: string;
  quoteDate?:     string;
  originCity?:    string;
  originState?:   string;
  destCity?:      string;
  destState?:     string;
  equipment?:     string;
  rate?:          string;
  baseRate?:      string;
  fuelSurcharge?: string;
  accessorials?:  string;
  lbs?:           string;
  miles?:         string;
  margin?:        string;
  status?:        string;
  carrier?:       string;
  mcNumber?:      string;
  notes?:         string;
  customer?:      string;
  jobId?:         string;
}

// ---------------------------------------------------------------------------
// Column name normalisation & mapping
// ---------------------------------------------------------------------------

/** Strip spaces, underscores, hyphens, dots and lower-case */
function norm(s: string): string {
  return String(s ?? '').toLowerCase().replace(/[\s_.#-]/g, '');
}

const COL_MAP: Array<{ keys: string[]; field: keyof RowData }> = [
  { keys: ['quote',  'quoteno',  'quotenum',  'requestno',   'requestnum',  'request',  'quoteid', 'id'],  field: 'requestNumber' },
  { keys: ['date',   'quotedate','shipdate',  'orderdate'],                                                 field: 'quoteDate'     },
  { keys: ['origincity',   'origcity',   'fromcity'],                                                      field: 'originCity'    },
  { keys: ['originstate',  'origstate',  'fromstate'],                                                     field: 'originState'   },
  { keys: ['destcity',     'destinationcity',  'tocity',   'shipcity'],                                    field: 'destCity'      },
  { keys: ['deststate',    'destinationstate', 'tostate',  'shipstate'],                                   field: 'destState'     },
  { keys: ['origin',       'from',  'originlocation'],                                                     field: 'originCity'    }, // full "City, ST" in one column
  { keys: ['destination',  'dest',  'to',  'destinationlocation'],                                        field: 'destCity'      }, // full "City, ST" in one column
  { keys: ['equipment',    'equiptype',   'equipmenttype', 'trailer',  'trailertype'],                     field: 'equipment'     },
  { keys: ['rate',         'totalrate',   'quoteamount',   'quotetocustomer', 'customerrate', 'amount'],   field: 'rate'          },
  { keys: ['baserate',     'linehaul',    'linehaulrate',  'baseamount'],                                  field: 'baseRate'      },
  { keys: ['fuelsurcharge','fuel',        'fsc',           'fuelsurcharge'],                               field: 'fuelSurcharge' },
  { keys: ['accessorials', 'accessorial', 'other',         'misc',          'fees'],                      field: 'accessorials'  },
  { keys: ['lbs',          'weight',      'weightlbs'],                                                    field: 'lbs'           },
  { keys: ['miles',        'distance',    'milesdriven'],                                                  field: 'miles'         },
  { keys: ['margin',       'marginpct',   'marginpercent', 'grossmargin'],                                 field: 'margin'        },
  { keys: ['status',       'quotestatus', 'result'],                                                       field: 'status'        },
  { keys: ['carrier',      'carriername', 'vendor'],                                                       field: 'carrier'       },
  { keys: ['mc',           'mcnumber',    'mcno',          'carriermcno'],                                 field: 'mcNumber'      },
  { keys: ['notes',        'note',        'comments',      'comment'],                                     field: 'notes'         },
  { keys: ['customer',     'customername','client'],                                                       field: 'customer'      },
  { keys: ['job',          'jobid',       'jobno',         'jobnum'],                                      field: 'jobId'         },
];

function buildColumnMap(headers: (string | undefined)[]): Map<number, keyof RowData> {
  const result = new Map<number, keyof RowData>();
  headers.forEach((h, i) => {
    if (!h) return;
    const n = norm(h);
    for (const { keys, field } of COL_MAP) {
      if (keys.some((k) => n === k || n.startsWith(k))) {
        if (!Array.from(result.values()).includes(field)) {
          result.set(i, field);
        }
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
  return parseFloat(s.replace(/[$,%\s]/g, '').replace(/,/g, '')) || 0;
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
  // Create new carrier
  return db.carrier.create({
    data: {
      name:        name || `Carrier ${mcNumber}`,
      mcNumber:    mcNumber || null,
      type:        CarrierType.CARRIER,
      isAssetBased: false,
      isBroker:    false,
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
// Row processor
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

  const origin = await upsertLocation(originCity, originState || 'XX');
  const dest   = await upsertLocation(destCity,   destState   || 'XX');
  const miles  = parseNum(row.miles ?? '');
  const lane   = await upsertLane(origin.id, dest.id, miles || undefined);

  // Carrier
  let carrierId: string | null = null;
  if (row.carrier || row.mcNumber) {
    const carrier = await getOrCreateCarrier(row.carrier ?? '', row.mcNumber);
    carrierId = carrier.id;
  }

  // Rates
  const quoteToCustomer = parseNum(row.rate ?? '');
  const marginPct       = row.margin ? parseNum(row.margin) / 100 : 0;
  const carrierTotal    = parseFloat((quoteToCustomer * (1 - marginPct)).toFixed(2));

  const quoteDate = parseDate(row.quoteDate ?? '') ?? new Date();
  const requestNumber = row.requestNumber?.trim();

  if (!requestNumber) {
    errors.push(`Row ${rowNum}: missing quote/request number — row skipped`);
    return 'skipped';
  }

  const status = mapStatus(row.status ?? '');

  const quoteData = {
    type:              QuoteType.FIRM,
    status,
    jobId:             row.jobId?.trim()   || requestNumber,
    customer:          row.customer?.trim() || 'Unknown',
    laneId:            lane.id,
    siteId,
    quoteToCustomer,
    carrierTotal,
    markup:            marginPct,
    quoteDate,
    selectedCarrierId: carrierId,
    notes:             row.notes?.trim() || null,
  };

  const existing = await db.quote.findUnique({ where: { requestNumber } });

  if (existing) {
    await db.quote.update({ where: { requestNumber }, data: quoteData });
    return 'updated';
  } else {
    await db.quote.create({ data: { requestNumber, ...quoteData } });
    return 'created';
  }
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
