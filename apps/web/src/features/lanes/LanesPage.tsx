import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Upload } from 'lucide-react'
import { lanesApi, type ApiLane } from '../../lib/api'

function fmtRate(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function LanesPage() {
  const navigate = useNavigate()

  const { data: lanes, isLoading, isError } = useQuery<ApiLane[]>({
    queryKey: ['lanes'],
    queryFn:  lanesApi.list,
    retry:    1,
  })

  const hasData = Array.isArray(lanes) && lanes.length > 0

  const totalLoads = hasData
    ? lanes.reduce((a, l) => a + l.metrics.reduce((s, m) => s + m.shipmentCount, 0), 0)
    : 0

  const laneCount = hasData ? lanes.length : 0

  // Compute avg $/mile across all lanes that have metrics
  const avgPerMile = hasData
    ? (() => {
        const rpmArr = lanes
          .map(l => l.metrics.find(m => m.ratePerMile != null)?.ratePerMile)
          .filter((v): v is number => v != null)
        return rpmArr.length > 0
          ? '$' + (rpmArr.reduce((s, v) => s + v, 0) / rpmArr.length).toFixed(2)
          : '—'
      })()
    : '—'

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Lane Intelligence</h1>
        <p className="text-muted-foreground mt-1">Historical rate analysis for all active lanes</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Lanes',       value: hasData ? laneCount.toString() : '—' },
          { label: 'Total Loads',        value: hasData ? totalLoads.toString() : '—' },
          { label: 'Avg $/Mile',         value: avgPerMile },
          { label: 'Lanes w/ Data',      value: hasData ? lanes.filter(l => l.metrics.length > 0).length.toString() : '—' },
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

        {isLoading && (
          <p className="text-muted-foreground text-sm py-12 text-center">Loading lanes…</p>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-destructive text-sm mb-2">Unable to load lanes from the API.</p>
            <p className="text-muted-foreground text-xs">Make sure the API server is running and the database has been seeded or an Excel import has been completed.</p>
          </div>
        )}

        {!isLoading && !isError && !hasData && (
          <div className="text-center py-12">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-white font-medium mb-1">No lane data yet</p>
            <p className="text-muted-foreground text-sm">Lanes will appear here once quotes have been imported.</p>
          </div>
        )}

        {hasData && (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full data-table">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3">Destination</th>
                  <th className="text-right pb-3">Miles</th>
                  <th className="text-right pb-3">Loads</th>
                  <th className="text-right pb-3">Avg Rate</th>
                  <th className="text-right pb-3">Min</th>
                  <th className="text-right pb-3">Max</th>
                  <th className="text-right pb-3">$/Mile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lanes!.map((lane) => {
                  const latestMetric   = lane.metrics[0]
                  const totalLaneLoads = lane.metrics.reduce((s, m) => s + m.shipmentCount, 0)
                  const destLabel      = `${lane.destination.city}, ${lane.destination.state}`
                  return (
                    <tr key={lane.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/lanes/${lane.id}`)}>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm text-white">{destLabel}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-sm text-muted-foreground">{lane.distance?.toLocaleString() ?? '—'}</td>
                      <td className="py-3 text-right text-sm font-semibold text-white">{totalLaneLoads}</td>
                      <td className="py-3 text-right text-sm font-semibold text-primary">{latestMetric ? fmtRate(latestMetric.avgRate) : '—'}</td>
                      <td className="py-3 text-right text-sm text-muted-foreground">{latestMetric ? fmtRate(latestMetric.minRate) : '—'}</td>
                      <td className="py-3 text-right text-sm text-muted-foreground">{latestMetric ? fmtRate(latestMetric.maxRate) : '—'}</td>
                      <td className="py-3 text-right text-sm text-muted-foreground">{latestMetric?.ratePerMile ? '$' + latestMetric.ratePerMile.toFixed(2) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
