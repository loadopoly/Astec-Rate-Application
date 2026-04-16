import { useNavigate } from 'react-router-dom'
import { Star, CheckCircle2, Users } from 'lucide-react'
import { carriers } from './carriers.data'

export function CarriersPage() {
  const navigate = useNavigate()
  const preferred = carriers.filter((c) => c.preferred)
  const totalLoads = carriers.reduce((a, c) => a + c.ytdLoads, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Carrier Management</h1>
        <p className="text-muted-foreground mt-1">Performance tracking and relationship management — {carriers.length} active carriers</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Carriers',    value: carriers.length.toString() },
          { label: 'Preferred',         value: preferred.length.toString() },
          { label: 'Loads Moved (YTD)', value: totalLoads.toString()       },
          { label: 'Best On-Time',      value: '98%',  sub: 'Regional Express' },
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
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-3">Carrier</th>
                <th className="text-left pb-3">MC #</th>
                <th className="text-left pb-3">Type</th>
                <th className="text-right pb-3">Lanes</th>
                <th className="text-right pb-3">Win Rate</th>
                <th className="text-right pb-3">Avg Rate</th>
                <th className="text-right pb-3">On-Time %</th>
                <th className="text-right pb-3">YTD Loads</th>
                <th className="text-right pb-3">YTD Spend</th>
                <th className="text-left pb-3 pl-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {carriers.map((c) => (
                <tr key={c.mc} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/carriers/${c.mc}`)}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {c.preferred && <Star className="h-3.5 w-3.5 text-primary fill-primary flex-shrink-0" />}
                      <span className="text-sm font-medium text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm font-mono text-muted-foreground">{c.mc}</td>
                  <td className="py-3 text-sm text-muted-foreground">{c.type}</td>
                  <td className="py-3 text-right text-sm text-white">{c.lanes}</td>
                  <td className="py-3 text-right">
                    <span className={`text-sm font-semibold ${c.winRate >= 70 ? 'text-success' : c.winRate >= 55 ? 'text-warning' : 'text-destructive'}`}>
                      {c.winRate}%
                    </span>
                  </td>
                  <td className="py-3 text-right text-sm font-semibold text-white">{c.avgRate}</td>
                  <td className="py-3 text-right">
                    <span className={`text-sm font-semibold ${c.onTime >= 95 ? 'text-success' : c.onTime >= 90 ? 'text-warning' : 'text-destructive'}`}>
                      {c.onTime}%
                    </span>
                  </td>
                  <td className="py-3 text-right text-sm text-white">{c.ytdLoads}</td>
                  <td className="py-3 text-right text-sm font-semibold text-white">{c.ytdSpend}</td>
                  <td className="py-3 pl-4">
                    {c.preferred ? (
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
      </div>
    </div>
  )
}

