import { useQuery } from '@tanstack/react-query'
import { DollarSign, TrendingUp, Truck, Upload } from 'lucide-react'
import { statsApi, type AnalyticsStats } from '../../lib/api'

function fmtRate(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function AnalyticsPage() {
  const { data: stats, isLoading, isError } = useQuery<AnalyticsStats>({
    queryKey: ['analytics-stats'],
    queryFn:  statsApi.analytics,
    retry:    1,
  })

  const kpis           = stats?.kpis
  const spendByCarrier = stats?.spendByCarrier ?? []
  const monthlyTrend   = stats?.monthlyTrend   ?? []
  const hasData        = !!kpis && kpis.totalLoads > 0

  const now  = new Date()
  const year = now.getFullYear()

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-muted-foreground mt-1">Year-to-date performance — {year}</p>
      </div>

      {isLoading && (
        <p className="text-muted-foreground text-sm py-12 text-center">Loading analytics…</p>
      )}

      {isError && (
        <div className="text-center py-12">
          <p className="text-destructive text-sm mb-2">Unable to load analytics from the API.</p>
          <p className="text-muted-foreground text-xs">Make sure the API server is running.</p>
        </div>
      )}

      {!isLoading && !isError && !hasData && (
        <div className="text-center py-16">
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-white font-medium mb-1">No analytics data yet</p>
          <p className="text-muted-foreground text-sm">Import your Excel spreadsheet or create quotes to see analytics here.</p>
        </div>
      )}

      {hasData && (
        <>
          {/* Top-line KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Freight Spend YTD', value: fmtRate(kpis!.totalSpend) },
              { label: 'Avg Margin (All Loads)',  value: `${kpis!.avgMargin}%` },
              { label: 'Loads Moved YTD',         value: kpis!.totalLoads.toString() },
              { label: 'Carriers Used',           value: kpis!.carriersUsed.toString() },
            ].map((k) => (
              <div key={k.label} className="bg-card rounded-xl border border-border px-5 py-5">
                <p className="text-2xl font-bold text-white">{k.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Spend by carrier */}
          {spendByCarrier.length > 0 && (
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
                        <span className="text-sm font-semibold text-white w-24 text-right">{fmtRate(c.spend)}</span>
                        <span className="text-xs text-muted-foreground w-10 text-right">{c.pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(c.pct, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monthly trend table */}
          {monthlyTrend.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-white mb-5">Monthly Performance Trend — {year}</h2>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full data-table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left pb-3">Month</th>
                      <th className="text-right pb-3">Loads</th>
                      <th className="text-right pb-3">Total Spend</th>
                      <th className="text-right pb-3">Avg Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {monthlyTrend.map((m) => (
                      <tr key={m.month} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-3 text-sm font-medium text-white">{m.month} {year}</td>
                        <td className="py-3 text-right text-sm text-white">{m.loads}</td>
                        <td className="py-3 text-right text-sm font-semibold text-white">{fmtRate(m.spend)}</td>
                        <td className="py-3 text-right text-sm font-semibold text-success">{m.margin}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-border bg-secondary/20">
                      <td className="py-3 text-sm font-bold text-white">YTD Total</td>
                      <td className="py-3 text-right text-sm font-bold text-white">{kpis!.totalLoads}</td>
                      <td className="py-3 text-right text-sm font-bold text-white">{fmtRate(kpis!.totalSpend)}</td>
                      <td className="py-3 text-right text-sm font-bold text-success">{kpis!.avgMargin}% avg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
