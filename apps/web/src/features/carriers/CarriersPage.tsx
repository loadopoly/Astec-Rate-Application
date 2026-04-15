import { Star, CheckCircle2, Users } from 'lucide-react'

const carriers = [
  { name: 'National Western Transport', mc: '234521', type: 'Asset',        lanes: 47, winRate: 73, avgRate: '$7,820', onTime: 96, preferred: true,  ytdLoads: 89,  ytdSpend: '$696,180' },
  { name: 'Landstar System',            mc: '191956', type: 'Broker',       lanes: 83, winRate: 61, avgRate: '$6,940', onTime: 94, preferred: true,  ytdLoads: 124, ytdSpend: '$860,560' },
  { name: 'Heavy Haul America',         mc: '487201', type: 'Asset',        lanes: 22, winRate: 81, avgRate: '$9,340', onTime: 93, preferred: true,  ytdLoads: 41,  ytdSpend: '$382,940' },
  { name: 'Anderson Trucking Service',  mc: '318291', type: 'Asset',        lanes: 35, winRate: 69, avgRate: '$8,150', onTime: 95, preferred: false, ytdLoads: 67,  ytdSpend: '$546,050' },
  { name: 'ArcBest / ABF Freight',      mc: '145421', type: 'Asset',        lanes: 29, winRate: 58, avgRate: '$4,200', onTime: 97, preferred: false, ytdLoads: 52,  ytdSpend: '$218,400' },
  { name: 'XPO Logistics',              mc: '573098', type: 'Asset/Broker', lanes: 41, winRate: 52, avgRate: '$5,920', onTime: 91, preferred: false, ytdLoads: 38,  ytdSpend: '$224,960' },
  { name: 'Regional Express Freight',   mc: '612847', type: 'Asset',        lanes: 18, winRate: 77, avgRate: '$2,890', onTime: 98, preferred: false, ytdLoads: 73,  ytdSpend: '$210,970' },
  { name: 'Estes Express Lines',        mc: '301556', type: 'Asset',        lanes: 15, winRate: 45, avgRate: '$3,850', onTime: 92, preferred: false, ytdLoads: 29,  ytdSpend: '$111,650' },
]

export function CarriersPage() {
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
          <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
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
                <tr key={c.mc} className="hover:bg-secondary/30 transition-colors cursor-pointer">
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

