import { DollarSign, TrendingUp, ArrowUpRight, Truck } from 'lucide-react'

const toplineKpis = [
  { label: 'Total Freight Spend YTD',  value: '$2,847,392', change: '+4.2% vs LY',   good: true  },
  { label: 'Savings vs Market Rate',   value: '$312,841',   change: '+14.7% vs LY',  good: true  },
  { label: 'Budget Accuracy',          value: '94.2%',      change: '+1.8 pts vs LY', good: true  },
  { label: 'Avg Margin (All Loads)',   value: '18.3%',      change: '+2.1 pts vs LY', good: true  },
  { label: 'Loads Moved YTD',          value: '847',        change: '+12.5% vs LY',  good: true  },
  { label: 'Carriers Used',            value: '8',          change: 'stable',         good: true  },
]

const spendByCarrier = [
  { carrier: 'Landstar System',           spend: '$860,560',  pct: 30.2, loads: 124 },
  { carrier: 'National Western Transport', spend: '$696,180', pct: 24.5, loads: 89  },
  { carrier: 'Anderson Trucking',         spend: '$546,050',  pct: 19.2, loads: 67  },
  { carrier: 'Heavy Haul America',        spend: '$382,940',  pct: 13.5, loads: 41  },
  { carrier: 'XPO Logistics',             spend: '$224,960',  pct:  7.9, loads: 38  },
  { carrier: 'All Others',                spend: '$136,702',  pct:  4.8, loads: 102 },
]

const savingsBreakdown = [
  { category: 'Preferred Carrier Rates vs Spot',    saved: '$148,230', pct: 47.4 },
  { category: 'Lane Optimization & Backhauls',      saved: '$87,140',  pct: 27.8 },
  { category: 'Volume Discounts (Top 3 Carriers)',  saved: '$51,920',  pct: 16.6 },
  { category: 'Route Consolidation',               saved: '$25,551',  pct:  8.2 },
]

const monthlyTrend = [
  { month: 'Jan', loads: 58, spend: '$187,420', margin: '17.1%', savings: '$21,840' },
  { month: 'Feb', loads: 61, spend: '$194,380', margin: '17.8%', savings: '$24,210' },
  { month: 'Mar', loads: 74, spend: '$241,650', margin: '18.0%', savings: '$30,190' },
  { month: 'Apr', loads: 73, spend: '$238,290', margin: '18.3%', savings: '$31,420' },
]

export function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-muted-foreground mt-1">Year-to-date performance — January through April 2026</p>
      </div>

      {/* Savings banner */}
      <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-success/10 border border-success/20">
        <div className="p-3 rounded-lg bg-success/20">
          <DollarSign className="h-6 w-6 text-success" />
        </div>
        <div>
          <p className="text-white font-semibold">IPS Freight has saved <span className="text-success font-bold text-lg">$312,841</span> vs. market spot rates year-to-date.</p>
          <p className="text-muted-foreground text-sm mt-0.5">That's 14.7% better than last year. Preferred carrier agreements + lane intelligence are working.</p>
        </div>
        <div className="ml-auto flex items-center gap-1 text-success font-bold text-lg flex-shrink-0">
          <ArrowUpRight className="h-5 w-5" />
          14.7%
        </div>
      </div>

      {/* Top-line KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {toplineKpis.map((k) => (
          <div key={k.label} className="bg-card rounded-xl border border-border px-5 py-5">
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{k.label}</p>
            <p className={`text-xs font-medium mt-1.5 flex items-center gap-1 ${k.good ? 'text-success' : 'text-destructive'}`}>
              {k.good && <TrendingUp className="h-3 w-3" />}
              {k.change}
            </p>
          </div>
        ))}
      </div>

      {/* Spend by carrier + Savings breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend by carrier */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-white mb-5">YTD Spend by Carrier</h2>
          <div className="space-y-4">
            {spendByCarrier.map((c) => (
              <div key={c.carrier}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-white">{c.carrier}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{c.loads} loads</span>
                    <span className="text-sm font-semibold text-white w-24 text-right">{c.spend}</span>
                    <span className="text-xs text-muted-foreground w-10 text-right">{c.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings breakdown */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-white mb-5">How We Saved $312K</h2>
          <div className="space-y-4">
            {savingsBreakdown.map((s) => (
              <div key={s.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-white">{s.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-success">{s.saved}</span>
                    <span className="text-xs text-muted-foreground w-10 text-right">{s.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Total Savings YTD</span>
            <span className="text-lg font-bold text-success">$312,841</span>
          </div>
        </div>
      </div>

      {/* Monthly trend table */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-white mb-5">Monthly Performance Trend — 2026</h2>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-3">Month</th>
                <th className="text-right pb-3">Loads</th>
                <th className="text-right pb-3">Total Spend</th>
                <th className="text-right pb-3">Avg Margin</th>
                <th className="text-right pb-3">Savings vs Market</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monthlyTrend.map((m) => (
                <tr key={m.month} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 text-sm font-medium text-white">{m.month} 2026</td>
                  <td className="py-3 text-right text-sm text-white">{m.loads}</td>
                  <td className="py-3 text-right text-sm font-semibold text-white">{m.spend}</td>
                  <td className="py-3 text-right text-sm font-semibold text-success">{m.margin}</td>
                  <td className="py-3 text-right text-sm font-bold text-success">{m.savings}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-border bg-secondary/20">
                <td className="py-3 text-sm font-bold text-white">YTD Total</td>
                <td className="py-3 text-right text-sm font-bold text-white">266</td>
                <td className="py-3 text-right text-sm font-bold text-white">$861,740</td>
                <td className="py-3 text-right text-sm font-bold text-success">18.1% avg</td>
                <td className="py-3 text-right text-sm font-bold text-success">$107,660</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

