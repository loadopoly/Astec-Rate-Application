import { useNavigate } from 'react-router-dom'
import { MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { lanes } from './lanes.data'

const trendConfig = {
  up:   { icon: TrendingUp,   color: 'text-success',     label: 'Up'     },
  down: { icon: TrendingDown, color: 'text-destructive', label: 'Down'   },
  flat: { icon: Minus,        color: 'text-muted-foreground', label: 'Stable' },
}

export function LanesPage() {
  const navigate = useNavigate()
  const totalLoads = lanes.reduce((a, l) => a + l.loads, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Lane Intelligence</h1>
        <p className="text-muted-foreground mt-1">Historical rate analysis for all active lanes — last 12 months</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Lanes',     value: lanes.length.toString() },
          { label: 'Total Loads (12mo)', value: totalLoads.toString() },
          { label: 'Avg $/Mile',       value: '$5.91' },
          { label: 'Trending Up',      value: `${lanes.filter(l => l.trend === 'up').length} lanes` },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border px-5 py-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lane Table */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">All Lanes — Sorted by Volume</h2>
          <span className="text-xs text-muted-foreground">Origin: Jerome Ave., Chattanooga TN</span>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-3">Destination</th>
                <th className="text-right pb-3">Miles</th>
                <th className="text-right pb-3">Loads (12mo)</th>
                <th className="text-right pb-3">Avg Rate</th>
                <th className="text-right pb-3">Min</th>
                <th className="text-right pb-3">Max</th>
                <th className="text-right pb-3">$/Mile</th>
                <th className="text-left pb-3 pl-4">Rate Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lanes.map((lane) => {
                const t = trendConfig[lane.trend as keyof typeof trendConfig]
                const TIcon = t.icon
                return (
                  <tr key={lane.dest} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/lanes/${encodeURIComponent(lane.dest)}`)}>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                        <span className="text-sm text-white" aria-label={`from ${lane.origin} to ${lane.dest}`}>{lane.dest}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right text-sm text-muted-foreground">{lane.miles}</td>
                    <td className="py-3 text-right text-sm font-semibold text-white">{lane.loads}</td>
                    <td className="py-3 text-right text-sm font-semibold text-primary">{lane.avgRate}</td>
                    <td className="py-3 text-right text-sm text-muted-foreground">{lane.minRate}</td>
                    <td className="py-3 text-right text-sm text-muted-foreground">{lane.maxRate}</td>
                    <td className="py-3 text-right text-sm text-muted-foreground">{lane.ratePerMile}</td>
                    <td className="py-3 pl-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${t.color}`}>
                        <TIcon className="h-3.5 w-3.5" />
                        {t.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

