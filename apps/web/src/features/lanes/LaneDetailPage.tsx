import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MapPin, Truck, Loader2 } from 'lucide-react'
import { lanesApi, type ApiLaneDetail } from '../../lib/api'

function fmtRate(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function LaneDetailPage() {
  const { dest } = useParams<{ dest: string }>()
  const navigate = useNavigate()

  // The param could be a cuid lane id or an encoded destination name
  const laneId = decodeURIComponent(dest ?? '')

  const { data: lane, isLoading, isError } = useQuery<ApiLaneDetail>({
    queryKey: ['lane', laneId],
    queryFn:  () => lanesApi.get(laneId) as Promise<ApiLaneDetail>,
    enabled:  !!laneId,
    retry:    1,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 animate-fade-in">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (isError || !lane) {
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

  // Compute stats from metrics
  const allMetrics = lane.metrics ?? []
  const totalLoads = allMetrics.reduce((s, m) => s + m.shipmentCount, 0)
  const latestMetric = allMetrics[0]

  // Rate stats across all metrics
  const allRates = allMetrics.filter(m => m.avgRate > 0)
  const avgRate = allRates.length > 0
    ? Math.round(allRates.reduce((s, m) => s + m.avgRate, 0) / allRates.length)
    : 0
  const minRate = allRates.length > 0
    ? Math.min(...allRates.map(m => m.minRate))
    : 0
  const maxRate = allRates.length > 0
    ? Math.max(...allRates.map(m => m.maxRate))
    : 0
  const avgPerMile = latestMetric?.ratePerMile
    ? '$' + latestMetric.ratePerMile.toFixed(2)
    : '—'

  // Recent quotes on this lane
  const laneQuotes = lane.quotes ?? []

  // Top carriers from quotes
  const carrierCounts = new Map<string, number>()
  for (const q of laneQuotes) {
    const name = q.selectedCarrier?.name
    if (name) carrierCounts.set(name, (carrierCounts.get(name) ?? 0) + 1)
  }
  const topCarriers = Array.from(carrierCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

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
              {lane.origin.city}, {lane.origin.state} → {lane.destination.city}, {lane.destination.state}
            </h1>
            <p className="text-muted-foreground mt-1">
              {lane.distance ? `${lane.distance.toLocaleString()} miles` : 'Distance unknown'}
              {totalLoads > 0 ? ` · ${totalLoads} loads` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Rate',     value: avgRate > 0 ? fmtRate(avgRate) : '—',     sub: 'Average' },
          { label: 'Min Rate',     value: minRate > 0 ? fmtRate(minRate) : '—',     sub: 'Lowest recorded' },
          { label: 'Max Rate',     value: maxRate > 0 ? fmtRate(maxRate) : '—',     sub: 'Highest recorded' },
          { label: '$/Mile',       value: avgPerMile,                                sub: 'Average rate/mile' },
        ].map((k) => (
          <div key={k.label} className="bg-card rounded-xl border border-border px-5 py-4">
            <p className="text-xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            <p className="text-xs text-primary font-medium mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Quote history + lane details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quote history table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-white mb-4">Recent Quotes on This Lane</h2>
          {laneQuotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3">Quote #</th>
                    <th className="text-left pb-3">Date</th>
                    <th className="text-right pb-3">Rate</th>
                    <th className="text-left pb-3 pl-4">Carrier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {laneQuotes.map((q) => (
                    <tr key={q.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/quotes/${q.requestNumber}`)}>
                      <td className="py-3 text-primary text-sm font-mono">{q.requestNumber}</td>
                      <td className="py-3 text-sm text-muted-foreground">{fmtDate(q.quoteDate)}</td>
                      <td className="py-3 text-right text-sm font-semibold text-white">{fmtRate(q.quoteToCustomer)}</td>
                      <td className="py-3 pl-4 text-sm text-muted-foreground">{q.selectedCarrier?.name ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-6 text-center">No quotes recorded for this lane.</p>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {topCarriers.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                Top Carriers on Lane
              </h2>
              <div className="space-y-2">
                {topCarriers.map(([name, count], i) => (
                  <div key={name} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <span className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
                    <span className="text-sm text-white flex-1">{name}</span>
                    <span className="text-xs text-muted-foreground">{count} loads</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Lane Details
            </h2>
            <div className="space-y-3">
              <DetailRow label="Total Loads" value={totalLoads > 0 ? totalLoads.toString() : '—'} />
              <DetailRow label="Distance" value={lane.distance ? `${lane.distance.toLocaleString()} miles` : '—'} />
            </div>
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
