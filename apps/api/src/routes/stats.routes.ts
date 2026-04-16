import { Router, Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import db from '../lib/db';

type QuoteRow = Prisma.QuoteGetPayload<{ select: { quoteToCustomer: true; markup: true; status: true } }>;

export const statsRoutes = Router();

/**
 * GET /api/v1/stats/dashboard
 *
 * Returns summary KPIs and the 5 most recent quotes for the dashboard page.
 * All values are computed from real database data.
 */
statsRoutes.get('/dashboard', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const now         = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Month-to-date quotes
    const monthQuotes = await db.quote.findMany({
      where:  { quoteDate: { gte: startOfMonth } },
      select: { quoteToCustomer: true, markup: true, status: true },
    });

    const totalQuotes = monthQuotes.length;
    const wonQuotes   = monthQuotes.filter((q: QuoteRow) => q.status === 'CLOSED').length;
    const winRate     = totalQuotes > 0 ? Math.round((wonQuotes / totalQuotes) * 100 * 10) / 10 : 0;
    const avgMargin   = totalQuotes > 0
      ? Math.round(monthQuotes.reduce((s: number, q: QuoteRow) => s + q.markup, 0) / totalQuotes * 100 * 10) / 10
      : 0;
    const totalValue  = Math.round(monthQuotes.reduce((s: number, q: QuoteRow) => s + q.quoteToCustomer, 0));

    // Active carriers
    const activeCarriers = await db.carrier.count({ where: { isActive: true } });

    // 5 most recent quotes (for the dashboard table)
    const recentQuotes = await db.quote.findMany({
      orderBy: { quoteDate: 'desc' },
      take:    5,
      include: {
        lane: { include: { origin: true, destination: true } },
        selectedCarrier: { select: { id: true, name: true, mcNumber: true } },
      },
    });

    // Top lanes this week
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekQuotes = await db.quote.findMany({
      where:   { quoteDate: { gte: startOfWeek } },
      include: {
        lane: { include: { origin: true, destination: true } },
      },
    });

    const laneCounts = new Map<string, number>();
    for (const q of weekQuotes) {
      const label = `${q.lane.origin.city} → ${q.lane.destination.city}, ${q.lane.destination.state}`;
      laneCounts.set(label, (laneCounts.get(label) ?? 0) + 1);
    }
    const topLanes = Array.from(laneCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([lane, count]) => ({ lane, count }));

    res.json({
      kpis: {
        totalQuotes,
        wonQuotes,
        winRate,
        avgMargin,
        totalValue,
        activeCarriers,
      },
      recentQuotes,
      topLanes,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/stats/analytics
 *
 * Returns year-to-date analytics data.
 */
statsRoutes.get('/analytics', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const now   = new Date();
    const year  = now.getFullYear();
    const start = new Date(year, 0, 1);

    // All quotes this year
    const ytdQuotes = await db.quote.findMany({
      where:   { quoteDate: { gte: start } },
      include: {
        selectedCarrier: { select: { name: true } },
      },
      orderBy: { quoteDate: 'asc' },
    });

    // Top-line KPIs
    const totalSpend   = Math.round(ytdQuotes.reduce((s: number, q) => s + q.quoteToCustomer, 0));
    const totalLoads   = ytdQuotes.length;
    const avgMargin    = totalLoads > 0
      ? Math.round(ytdQuotes.reduce((s: number, q) => s + q.markup, 0) / totalLoads * 100 * 10) / 10
      : 0;

    // Spend by carrier
    const carrierSpend = new Map<string, { spend: number; loads: number }>();
    for (const q of ytdQuotes) {
      const name = q.selectedCarrier?.name ?? 'Unassigned';
      const entry = carrierSpend.get(name) ?? { spend: 0, loads: 0 };
      entry.spend += q.quoteToCustomer;
      entry.loads += 1;
      carrierSpend.set(name, entry);
    }
    const spendByCarrier = Array.from(carrierSpend.entries())
      .sort((a, b) => b[1].spend - a[1].spend)
      .map(([carrier, data]) => ({
        carrier,
        spend:  Math.round(data.spend),
        loads:  data.loads,
        pct:    totalSpend > 0 ? Math.round(data.spend / totalSpend * 100 * 10) / 10 : 0,
      }));

    // Monthly trend
    const monthlyMap = new Map<number, { loads: number; spend: number; marginSum: number }>();
    for (const q of ytdQuotes) {
      const m = q.quoteDate.getMonth(); // 0-based
      const entry = monthlyMap.get(m) ?? { loads: 0, spend: 0, marginSum: 0 };
      entry.loads += 1;
      entry.spend += q.quoteToCustomer;
      entry.marginSum += q.markup;
      monthlyMap.set(m, entry);
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrend = Array.from(monthlyMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([m, data]) => ({
        month:  monthNames[m],
        loads:  data.loads,
        spend:  Math.round(data.spend),
        margin: data.loads > 0
          ? `${Math.round(data.marginSum / data.loads * 100 * 10) / 10}%`
          : '0%',
      }));

    // Active carriers count
    const carriersUsed = await db.carrier.count({ where: { isActive: true } });

    res.json({
      kpis: {
        totalSpend,
        totalLoads,
        avgMargin,
        carriersUsed,
      },
      spendByCarrier,
      monthlyTrend,
    });
  } catch (err) {
    next(err);
  }
});
