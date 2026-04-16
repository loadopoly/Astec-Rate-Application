/**
 * Prisma seed script — populates the database with the historical data
 * that was previously kept only in the Excel sheet / static mock files.
 *
 * Run with:  npx tsx prisma/seed.ts
 * Or via:   npm run db:seed   (inside apps/api)
 */

import { PrismaClient, QuoteStatus, QuoteType, CarrierType } from '@prisma/client';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseRate(s: string): number {
  return parseFloat(s.replace(/[$,%]/g, '').replace(/,/g, '')) || 0;
}

function parseDate(day: string, year = 2026): Date {
  return new Date(`${day} ${year}`);
}

function mapStatus(s: string): QuoteStatus {
  switch (s) {
    case 'won':      return QuoteStatus.CLOSED;
    case 'approved': return QuoteStatus.QUOTED;
    case 'lost':     return QuoteStatus.LOST_SALE;
    default:         return QuoteStatus.PENDING;
  }
}

function equipField(equip: string): {
  flatbedQty: number; stepDeckQty: number; doubleDeckQty: number;
  towawayQty: number; dollyQty: number; rgnQty: number;
  flatbedRate: number; stepDeckRate: number; doubleDeckRate: number;
  towawayRate: number; dollyRate: number; rgnRate: number;
} {
  const base = {
    flatbedQty: 0, stepDeckQty: 0, doubleDeckQty: 0,
    towawayQty: 0, dollyQty: 0, rgnQty: 0,
    flatbedRate: 0, stepDeckRate: 0, doubleDeckRate: 0,
    towawayRate: 0, dollyRate: 0, rgnRate: 0,
  };
  return base;
}

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

const SITE = {
  name: 'Chattanooga',
  code: 'CHT',
  address: '1 Jerome Ave',
  city: 'Chattanooga',
  state: 'TN',
  zip: '37402',
};

const CARRIER_ROWS = [
  { name: 'National Western Transport', mc: '234521', dot: '1038491', type: CarrierType.CARRIER,        isPreferred: true  },
  { name: 'Landstar System',            mc: '191956', dot: '924920',  type: CarrierType.CARRIER_BROKER, isPreferred: true  },
  { name: 'Heavy Haul America',         mc: '487201', dot: '2187643', type: CarrierType.CARRIER,        isPreferred: true  },
  { name: 'Anderson Trucking Service',  mc: '318291', dot: '1572834', type: CarrierType.CARRIER,        isPreferred: false },
  { name: 'ArcBest / ABF Freight',      mc: '145421', dot: '615079',  type: CarrierType.CARRIER,        isPreferred: false },
  { name: 'XPO Logistics',              mc: '573098', dot: '2339271', type: CarrierType.CARRIER_BROKER, isPreferred: false },
  { name: 'Regional Express Freight',   mc: '612847', dot: '2841927', type: CarrierType.CARRIER,        isPreferred: false },
  { name: 'Estes Express Lines',        mc: '301556', dot: '1043167', type: CarrierType.CARRIER,        isPreferred: false },
];

// Carrier name aliases used in quotes.data
const CARRIER_ALIAS: Record<string, string> = {
  'Natl Western': 'National Western Transport',
  'Anderson':     'Anderson Trucking Service',
  'ArcBest':      'ArcBest / ABF Freight',
  'Heavy Haul USA': 'Heavy Haul America',
  'Regional Exp.': 'Regional Express Freight',
  'Estes':        'Estes Express Lines',
  'Landstar':     'Landstar System',
  'XPO Logistics': 'XPO Logistics',
};

const QUOTE_ROWS = [
  { id: 'CHT-0847', date: 'Apr 15', origin: 'Chattanooga, TN', dest: 'Denver, CO',       equipment: 'RGN',       lbs: '85,000', miles: '1,648', rate: '$8,400', baseRate: '$7,140', fuelSurcharge: '$924',   accessorials: '$336', carrier: 'Natl Western',   carrierMc: '234521', margin: '21%', status: 'approved', notes: 'Oversized load — permit required through CO. Allow 3-day lead time.' },
  { id: 'CHT-0846', date: 'Apr 14', origin: 'Chattanooga, TN', dest: 'Phoenix, AZ',      equipment: 'Lowboy',    lbs: '92,000', miles: '1,979', rate: '$9,200', baseRate: '$7,820', fuelSurcharge: '$1,012', accessorials: '$368', carrier: 'Landstar',       carrierMc: '191956', margin: '18%', status: 'won',      notes: 'Heavy haul via I-40. Escort required in AZ.' },
  { id: 'CHT-0845', date: 'Apr 14', origin: 'Chattanooga, TN', dest: 'Columbus, OH',     equipment: 'Flatbed',   lbs: '45,000', miles: '424',   rate: '$3,800', baseRate: '$3,230', fuelSurcharge: '$418',   accessorials: '$152', carrier: 'ArcBest',        carrierMc: '145421', margin: '22%', status: 'pending',  notes: 'Standard flatbed. Awaiting customer PO confirmation.' },
  { id: 'CHT-0844', date: 'Apr 12', origin: 'Chattanooga, TN', dest: 'Dallas, TX',       equipment: 'RGN',       lbs: '78,000', miles: '669',   rate: '$7,100', baseRate: '$6,035', fuelSurcharge: '$781',   accessorials: '$284', carrier: 'Anderson',       carrierMc: '318291', margin: '19%', status: 'approved', notes: 'Repeat lane — Anderson preferred for TX hauls.' },
  { id: 'CHT-0843', date: 'Apr 11', origin: 'Chattanooga, TN', dest: 'Portland, OR',     equipment: 'Lowboy',    lbs: '110,000',miles: '2,389', rate: '$11,800',baseRate: '$10,030',fuelSurcharge: '$1,298', accessorials: '$472', carrier: 'Natl Western',   carrierMc: '234521', margin: '15%', status: 'won',      notes: 'Super-heavy haul. Multi-state permits. Route survey required.' },
  { id: 'CHT-0842', date: 'Apr 11', origin: 'Chattanooga, TN', dest: 'Chicago, IL',      equipment: 'Step-Deck', lbs: '38,000', miles: '480',   rate: '$3,200', baseRate: '$2,720', fuelSurcharge: '$352',   accessorials: '$128', carrier: 'Estes',          carrierMc: '301556', margin: '24%', status: 'pending',  notes: 'Step-deck for tall cargo. Chicago docking restrictions apply.' },
  { id: 'CHT-0841', date: 'Apr 10', origin: 'Chattanooga, TN', dest: 'Houston, TX',      equipment: 'RGN',       lbs: '95,000', miles: '834',   rate: '$8,700', baseRate: '$7,395', fuelSurcharge: '$957',   accessorials: '$348', carrier: 'Anderson',       carrierMc: '318291', margin: '20%', status: 'approved', notes: 'Industrial equipment delivery to Houston port facility.' },
  { id: 'CHT-0840', date: 'Apr 10', origin: 'Chattanooga, TN', dest: 'Atlanta, GA',      equipment: 'Flatbed',   lbs: '42,000', miles: '118',   rate: '$2,100', baseRate: '$1,785', fuelSurcharge: '$231',   accessorials: '$84',  carrier: 'Regional Exp.', carrierMc: '612847', margin: '28%', status: 'won',      notes: 'Short regional haul — Regional Express preferred.' },
  { id: 'CHT-0839', date: 'Apr 9',  origin: 'Chattanooga, TN', dest: 'Kansas City, MO',  equipment: 'Step-Deck', lbs: '51,000', miles: '621',   rate: '$4,650', baseRate: '$3,953', fuelSurcharge: '$512',   accessorials: '$185', carrier: 'Landstar',       carrierMc: '191956', margin: '17%', status: 'lost',     notes: 'Lost to competitor. Customer went with a spot rate.' },
  { id: 'CHT-0838', date: 'Apr 8',  origin: 'Chattanooga, TN', dest: 'Los Angeles, CA',  equipment: 'Lowboy',    lbs: '88,000', miles: '2,180', rate: '$10,400',baseRate: '$8,840', fuelSurcharge: '$1,144', accessorials: '$416', carrier: 'XPO Logistics',  carrierMc: '573098', margin: '16%', status: 'won',      notes: 'Long-haul lowboy to LA. CA permit required.' },
  { id: 'CHT-0837', date: 'Apr 7',  origin: 'Chattanooga, TN', dest: 'Minneapolis, MN',  equipment: 'RGN',       lbs: '74,000', miles: '817',   rate: '$6,900', baseRate: '$5,865', fuelSurcharge: '$759',   accessorials: '$276', carrier: 'Heavy Haul USA', carrierMc: '487201', margin: '23%', status: 'approved', notes: 'MN winter routing — weight restrictions on some county roads.' },
  { id: 'CHT-0836', date: 'Apr 7',  origin: 'Chattanooga, TN', dest: 'Nashville, TN',    equipment: 'Flatbed',   lbs: '36,000', miles: '134',   rate: '$1,950', baseRate: '$1,658', fuelSurcharge: '$215',   accessorials: '$78',  carrier: 'Regional Exp.', carrierMc: '612847', margin: '31%', status: 'won',      notes: 'Short in-state haul. Quick turnaround.' },
];

// Lane metrics (from lanes.data.ts)
const LANE_METRICS = [
  { origin: 'Chattanooga, TN', dest: 'Atlanta, GA',      miles: 118,   minRate: 1400,  maxRate: 2100,  avgRate: 1734,  months: [{ m: 1, loads: 14, avg: 1690 }, { m: 2, loads: 16, avg: 1710 }, { m: 3, loads: 19, avg: 1750 }, { m: 4, loads: 18, avg: 1785 }] },
  { origin: 'Chattanooga, TN', dest: 'Chicago, IL',      miles: 480,   minRate: 2400,  maxRate: 3600,  avgRate: 2967,  months: [{ m: 1, loads: 11, avg: 2890 }, { m: 2, loads: 13, avg: 2930 }, { m: 3, loads: 15, avg: 2980 }, { m: 4, loads: 13, avg: 3070 }] },
  { origin: 'Chattanooga, TN', dest: 'Columbus, OH',     miles: 424,   minRate: 2200,  maxRate: 3500,  avgRate: 2841,  months: [{ m: 1, loads: 9,  avg: 2690 }, { m: 2, loads: 11, avg: 2780 }, { m: 3, loads: 14, avg: 2870 }, { m: 4, loads: 13, avg: 3025 }] },
  { origin: 'Chattanooga, TN', dest: 'Nashville, TN',    miles: 134,   minRate: 1500,  maxRate: 2300,  avgRate: 1876,  months: [{ m: 1, loads: 9,  avg: 1800 }, { m: 2, loads: 10, avg: 1840 }, { m: 3, loads: 13, avg: 1895 }, { m: 4, loads: 12, avg: 1950 }] },
  { origin: 'Chattanooga, TN', dest: 'Dallas, TX',       miles: 669,   minRate: 3400,  maxRate: 5200,  avgRate: 4192,  months: [{ m: 1, loads: 8,  avg: 4050 }, { m: 2, loads: 9,  avg: 4120 }, { m: 3, loads: 11, avg: 4230 }, { m: 4, loads: 10, avg: 4370 }] },
  { origin: 'Chattanooga, TN', dest: 'Houston, TX',      miles: 834,   minRate: 4400,  maxRate: 6600,  avgRate: 5421,  months: [{ m: 1, loads: 5,  avg: 5200 }, { m: 2, loads: 7,  avg: 5310 }, { m: 3, loads: 9,  avg: 5480 }, { m: 4, loads: 8,  avg: 5695 }] },
  { origin: 'Chattanooga, TN', dest: 'Denver, CO',       miles: 1648,  minRate: 4800,  maxRate: 7200,  avgRate: 5847,  months: [{ m: 1, loads: 4,  avg: 5590 }, { m: 2, loads: 5,  avg: 5710 }, { m: 3, loads: 7,  avg: 5890 }, { m: 4, loads: 7,  avg: 6200 }] },
  { origin: 'Chattanooga, TN', dest: 'Kansas City, MO',  miles: 621,   minRate: 3200,  maxRate: 5100,  avgRate: 4083,  months: [{ m: 1, loads: 6,  avg: 4310 }, { m: 2, loads: 6,  avg: 4190 }, { m: 3, loads: 5,  avg: 4040 }, { m: 4, loads: 4,  avg: 3790 }] },
  { origin: 'Chattanooga, TN', dest: 'Minneapolis, MN',  miles: 817,   minRate: 4100,  maxRate: 6400,  avgRate: 5172,  months: [{ m: 1, loads: 4,  avg: 4890 }, { m: 2, loads: 4,  avg: 5050 }, { m: 3, loads: 6,  avg: 5220 }, { m: 4, loads: 5,  avg: 5530 }] },
  { origin: 'Chattanooga, TN', dest: 'Phoenix, AZ',      miles: 1979,  minRate: 5800,  maxRate: 9100,  avgRate: 7213,  months: [{ m: 1, loads: 5,  avg: 7540 }, { m: 2, loads: 5,  avg: 7310 }, { m: 3, loads: 5,  avg: 7120 }, { m: 4, loads: 3,  avg: 6880 }] },
  { origin: 'Chattanooga, TN', dest: 'Los Angeles, CA',  miles: 2180,  minRate: 7200,  maxRate: 11200, avgRate: 8941,  months: [{ m: 1, loads: 3,  avg: 8490 }, { m: 2, loads: 3,  avg: 8720 }, { m: 3, loads: 5,  avg: 9020 }, { m: 4, loads: 4,  avg: 9534 }] },
  { origin: 'Chattanooga, TN', dest: 'Portland, OR',     miles: 2389,  minRate: 8100,  maxRate: 12400, avgRate: 9876,  months: [{ m: 1, loads: 2,  avg: 9340 }, { m: 2, loads: 3,  avg: 9620 }, { m: 3, loads: 4,  avg: 9980 }, { m: 4, loads: 3,  avg: 10564 }] },
];

// ---------------------------------------------------------------------------
// Seed helpers
// ---------------------------------------------------------------------------

function parseCityState(s: string): { city: string; state: string } {
  const parts = s.split(', ');
  return { city: parts[0].trim(), state: parts[1]?.trim() ?? '' };
}

async function upsertLocation(city: string, state: string) {
  return prisma.location.upsert({
    where: { city_state: { city, state } },
    update: {},
    create: { city, state },
  });
}

async function upsertLane(originId: string, destId: string, distance?: number) {
  return prisma.lane.upsert({
    where: { originId_destId: { originId, destId } },
    update: { distance },
    create: { originId, destId, distance },
  });
}

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------

async function main() {
  console.log('🌱  Starting database seed…');

  // If real data has already been imported, skip seeding to avoid
  // re-introducing mock data alongside the real data.
  const importCount = await prisma.importLog.count();
  if (importCount > 0) {
    console.log('  ⏭  Skipping seed — real data has been imported (%d import(s) found).', importCount);
    console.log('     To re-seed, first clear the import_log table.');
    return;
  }

  // 1. Site
  const site = await prisma.site.upsert({
    where: { code: SITE.code },
    update: {},
    create: SITE,
  });
  console.log(`  ✓ Site: ${site.name}`);

  // 2. Carriers
  const carrierMap: Record<string, string> = {}; // name → id
  for (const c of CARRIER_ROWS) {
    const carrier = await prisma.carrier.upsert({
      where: { mcNumber: c.mc },
      update: { name: c.name, dotNumber: c.dot, isPreferred: c.isPreferred },
      create: {
        name: c.name,
        mcNumber: c.mc,
        dotNumber: c.dot,
        type: c.type,
        isPreferred: c.isPreferred,
        isAssetBased: c.type === CarrierType.CARRIER,
        isBroker: c.type === CarrierType.CARRIER_BROKER,
      },
    });
    carrierMap[c.name] = carrier.id;
    carrierMap[c.mc]   = carrier.id;
  }
  console.log(`  ✓ Carriers: ${CARRIER_ROWS.length}`);

  // 3. Locations & Lanes for lane metrics
  const laneMap: Record<string, string> = {}; // "originId|destId" → laneId
  for (const lm of LANE_METRICS) {
    const { city: oc, state: os } = parseCityState(lm.origin);
    const { city: dc, state: ds } = parseCityState(lm.dest);
    const origin = await upsertLocation(oc, os);
    const dest   = await upsertLocation(dc, ds);
    const lane   = await upsertLane(origin.id, dest.id, lm.miles);
    laneMap[`${lm.origin}|${lm.dest}`] = lane.id;

    // Monthly lane metrics
    for (const mo of lm.months) {
      const period = new Date(2026, mo.m - 1, 1);
      await prisma.laneMetric.upsert({
        where: { laneId_period_equipmentType: { laneId: lane.id, period, equipmentType: null } },
        update: { avgRate: mo.avg, shipmentCount: mo.loads },
        create: {
          laneId:        lane.id,
          period,
          equipmentType: null,
          minRate:       lm.minRate,
          maxRate:       lm.maxRate,
          avgRate:       mo.avg,
          medianRate:    mo.avg,
          shipmentCount: mo.loads,
          ratePerMile:   lm.miles > 0 ? parseFloat((mo.avg / lm.miles).toFixed(4)) : null,
        },
      });
    }
  }
  console.log(`  ✓ Lane metrics: ${LANE_METRICS.length} lanes × 4 months`);

  // 4. Quotes
  let quotesCreated = 0;
  let quotesUpdated = 0;

  for (const q of QUOTE_ROWS) {
    const { city: oc, state: os } = parseCityState(q.origin);
    const { city: dc, state: ds } = parseCityState(q.dest);
    const origin = await upsertLocation(oc, os);
    const dest   = await upsertLocation(dc, ds);
    const lane   = await upsertLane(origin.id, dest.id, parseRate(q.miles));

    const carrierName = CARRIER_ALIAS[q.carrier] ?? q.carrier;
    const selectedCarrierId = carrierMap[carrierName] ?? carrierMap[q.carrierMc] ?? null;

    const quoteToCustomer = parseRate(q.rate);
    const marginPct       = parseRate(q.margin) / 100;
    const carrierTotal    = parseFloat((quoteToCustomer * (1 - marginPct)).toFixed(2));

    const existing = await prisma.quote.findUnique({ where: { requestNumber: q.id } });

    const quoteData = {
      type:             QuoteType.FIRM,
      status:           mapStatus(q.status),
      jobId:            q.id,
      customer:         'Astec Industries',
      laneId:           lane.id,
      siteId:           site.id,
      quoteToCustomer,
      carrierTotal,
      markup:           marginPct,
      quoteDate:        parseDate(q.date),
      notes:            q.notes,
      selectedCarrierId,
    };

    if (existing) {
      await prisma.quote.update({ where: { requestNumber: q.id }, data: quoteData });
      quotesUpdated++;
    } else {
      await prisma.quote.create({ data: { requestNumber: q.id, ...quoteData } });
      quotesCreated++;
    }
  }
  console.log(`  ✓ Quotes: ${quotesCreated} created, ${quotesUpdated} updated`);

  console.log('\n✅  Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
