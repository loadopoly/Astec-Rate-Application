import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, TrendingUp, TrendingDown, Minus, Truck } from 'lucide-react'
import { lanes } from './lanes.data'

const trendConfig = {
  up:   { icon: TrendingUp,   color: 'text-success',          label: 'Trending Up'   },
  down: { icon: TrendingDown, color: 'text-destructive',      label: 'Trending Down' },
  flat: { icon: Minus,        color: 'text-muted-foreground', label: 'Stable'        },
}

export function LaneDetailPage() {
  const { dest } = useParams<{ dest: string }>()
  const navigate = useNavigate()

  const lane = lanes.find((l) => l.dest === decodeURIComponent(dest ?? ''))

  if (!lane) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Lane not found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find lane data for this destination.</p>
        <button
          onClick={() => navigate('/lanes')}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lanes
        </button>
      </div>
    )
  }

  const t = trendConfig[lane.trend]
  const TIcon = t.icon

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + header */}
      <div>
        <button
          onClick={() => navigate('/lanes')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lane Intelligence
        </button>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {lane.origin} → {lane.dest}
            </h1>
            <p className="text-muted-foreground mt-1">{lane.miles} miles · {lane.loads} loads in last 12 months</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${t.color}`}>
            <TIcon className="h-4 w-4" />
            {t.label}
          </span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Rate',     value: lane.avgRate,     sub: '12-month average'  },
          { label: 'Min Rate',     value: lane.minRate,     sub: 'Lowest recorded'   },
          { label: 'Max Rate',     value: lane.maxRate,     sub: 'Highest recorded'  },
          { label: '$/Mile',       value: lane.ratePerMile, sub: 'Average rate/mile' },
        ].map((k) => (
          <div key={k.label} className="bg-card rounded-xl border border-border px-5 py-4">
            <p className="text-xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            <p className="text-xs text-primary font-medium mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly history + lane details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly history table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-white mb-4">Monthly Rate History — 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3">Month</th>
                  <th className="text-right pb-3">Loads</th>
                  <th className="text-right pb-3">Avg Rate</th>
                  <th className="text-right pb-3">Market Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lane.monthlyHistory.map((m) => (
                  <tr key={m.month} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 text-sm font-medium text-white">{m.month} 2026</td>
                    <td className="py-3 text-right text-sm text-white">{m.loads}</td>
                    <td className="py-3 text-right text-sm font-semibold text-primary">{m.avgRate}</td>
                    <td className="py-3 text-right text-sm font-bold text-success">{m.savings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lane details panel */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Top Carriers on Lane
            </h2>
            <div className="space-y-2">
              {lane.topCarriers.map((c, i) => (
                <div key={c} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <span className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
                  <span className="text-sm text-white">{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Lane Details
            </h2>
            <div className="space-y-3">
              <DetailRow label="Equipment Types" value={lane.equipment.join(', ')} />
              <DetailRow label="Total Loads (12mo)" value={lane.loads.toString()} />
              <DetailRow label="Distance" value={`${lane.miles} miles`} />
              <DetailRow label="Rate Trend" value={t.label} />
            </div>
            {lane.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">{lane.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-muted-foreground flex-shrink-0">{label}</span>
      <span className="text-sm text-white text-right">{value}</span>
    </div>
  )
}
