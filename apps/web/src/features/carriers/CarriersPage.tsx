import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Star, CheckCircle2, Users, Upload } from 'lucide-react'
import { carriersApi, type ApiCarrier } from '../../lib/api'

export function CarriersPage() {
  const navigate = useNavigate()

  const { data: carriers, isLoading, isError } = useQuery<ApiCarrier[]>({
    queryKey: ['carriers'],
    queryFn:  carriersApi.list,
    retry:    1,
  })

  const hasData = Array.isArray(carriers) && carriers.length > 0

  const preferred   = hasData ? carriers.filter((c) => c.isPreferred) : []
  const totalLoads  = hasData
    ? carriers.reduce((a, c) => a + c.performance.reduce((s, p) => s + p.wonBids, 0), 0)
    : 0
  const activeCount = hasData ? carriers.length : 0

  // Find best on-time carrier
  const bestOnTime = hasData
    ? carriers.reduce<{ name: string; pct: number }>((best, c) => {
        const avgOnTime = c.performance.length > 0
          ? c.performance.reduce((s, p) => s + (p.onTimeDelivery ?? 0), 0) / c.performance.length
          : 0
        return avgOnTime > best.pct ? { name: c.name, pct: Math.round(avgOnTime) } : best
      }, { name: '—', pct: 0 })
    : { name: '—', pct: 0 }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Carrier Management</h1>
        <p className="text-muted-foreground mt-1">Performance tracking and relationship management{hasData ? ` — ${activeCount} active carriers` : ''}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Carriers',    value: hasData ? activeCount.toString() : '—' },
          { label: 'Preferred',         value: hasData ? preferred.length.toString() : '—' },
          { label: 'Loads Moved (YTD)', value: hasData && totalLoads > 0 ? totalLoads.toString() : '—' },
          { label: 'Best On-Time',      value: bestOnTime.pct > 0 ? `${bestOnTime.pct}%` : '—',  sub: bestOnTime.name !== '—' ? bestOnTime.name : undefined },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border px-5 py-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub ?? s.label}</p>
            {s.sub && <p className="text-xs text-primary font-medium mt-0.5">{s.label}</p>}
          </div>
        ))}
      </div>

      {/* Carrier Table */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Carrier Roster</h2>
          <button onClick={() => navigate('/carriers/new')} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            <Users className="h-4 w-4" />
            Add Carrier
          </button>
        </div>

        {isLoading && (
          <p className="text-muted-foreground text-sm py-12 text-center">Loading carriers…</p>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-destructive text-sm mb-2">Unable to load carriers from the API.</p>
            <p className="text-muted-foreground text-xs">Make sure the API server is running and the database has been seeded or an Excel import has been completed.</p>
          </div>
        )}

        {!isLoading && !isError && !hasData && (
          <div className="text-center py-12">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-white font-medium mb-1">No carriers yet</p>
            <p className="text-muted-foreground text-sm">Carriers will appear here once data has been imported.</p>
          </div>
        )}

        {hasData && (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full data-table">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3">Carrier</th>
                  <th className="text-left pb-3">MC #</th>
                  <th className="text-left pb-3">Type</th>
                  <th className="text-left pb-3 pl-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {carriers!.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/carriers/${c.mcNumber ?? c.id}`)}>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {c.isPreferred && <Star className="h-3.5 w-3.5 text-primary fill-primary flex-shrink-0" />}
                        <span className="text-sm font-medium text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm font-mono text-muted-foreground">{c.mcNumber ?? '—'}</td>
                    <td className="py-3 text-sm text-muted-foreground">{c.type}</td>
                    <td className="py-3 pl-4">
                      {c.isPreferred ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          Preferred
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
