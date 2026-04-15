/**
 * Dashboard Page — Operations overview with real demo data
 */

import {
  Truck,
  MapPin,
  TrendingUp,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'

const kpis = [
  { title: 'Quotes This Month', value: '73', change: 8.2, trend: 'up' as const, icon: FileText },
  { title: 'Avg. Margin', value: '18.3%', change: 2.1, trend: 'up' as const, icon: TrendingUp },
  { title: 'Savings vs Market', value: '$312K', change: 14.7, trend: 'up' as const, icon: DollarSign },
  { title: 'Active Carriers', value: '21', change: 0, trend: 'neutral' as const, icon: Users },
]

const recentQuotes = [
  { id: 'CHT-0847', origin: 'Chattanooga, TN', dest: 'Denver, CO', equipment: 'RGN', lbs: '85,000', rate: '$8,400', carrier: 'Natl Western', margin: '21%', status: 'approved' },
  { id: 'CHT-0846', origin: 'Chattanooga, TN', dest: 'Phoenix, AZ', equipment: 'Lowboy', lbs: '92,000', rate: '$9,200', carrier: 'Landstar', margin: '18%', status: 'won' },
  { id: 'CHT-0845', origin: 'Chattanooga, TN', dest: 'Columbus, OH', equipment: 'Flatbed', lbs: '45,000', rate: '$3,800', carrier: 'ArcBest', margin: '22%', status: 'pending' },
  { id: 'CHT-0844', origin: 'Chattanooga, TN', dest: 'Dallas, TX', equipment: 'RGN', lbs: '78,000', rate: '$7,100', carrier: 'Anderson', margin: '19%', status: 'approved' },
  { id: 'CHT-0843', origin: 'Chattanooga, TN', dest: 'Portland, OR', equipment: 'Lowboy', lbs: '110,000', rate: '$11,800', carrier: 'Natl Western', margin: '15%', status: 'won' },
]

const statusConfig = {
  approved: { label: 'Approved', color: 'text-success bg-success/10', icon: CheckCircle2 },
  won: { label: 'Won', color: 'text-primary bg-primary/10', icon: Truck },
  pending: { label: 'Pending', color: 'text-warning bg-warning/10', icon: Clock },
  lost: { label: 'Lost', color: 'text-destructive bg-destructive/10', icon: AlertCircle },
}

export function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header + Savings Banner */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Operations Dashboard</h1>
          <p className="text-muted-foreground mt-1">Jerome Ave. Heavy Haul — Freight Management</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-success/10 border border-success/20">
          <TrendingUp className="h-5 w-5 text-success flex-shrink-0" />
          <p className="text-sm text-success font-medium">
            🎉 IPS Freight has saved <span className="font-bold">$312,841</span> vs. spot market rates year-to-date — a 14.7% improvement over last year.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quotes Table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Recent Quotes</h2>
            <span className="text-xs text-muted-foreground">Last 5 of 73 this month</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3">Quote #</th>
                  <th className="text-left pb-3">Route</th>
                  <th className="text-left pb-3">Equipment</th>
                  <th className="text-right pb-3">Rate</th>
                  <th className="text-right pb-3">Margin</th>
                  <th className="text-left pb-3 pl-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentQuotes.map((q) => {
                  const s = statusConfig[q.status as keyof typeof statusConfig]
                  const SIcon = s.icon
                  return (
                    <tr key={q.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3 text-primary text-sm font-mono">{q.id}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-white truncate max-w-[160px]" aria-label={`from ${q.origin} to ${q.dest}`}>{q.origin} → {q.dest}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">{q.equipment}</td>
                      <td className="py-3 text-right text-sm font-semibold text-white">{q.rate}</td>
                      <td className="py-3 text-right text-sm font-semibold text-success">{q.margin}</td>
                      <td className="py-3 pl-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${s.color}`}>
                          <SIcon className="h-3 w-3" />
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <QuickActionButton icon={FileText} label="New Budget Quote" />
            <QuickActionButton icon={MapPin} label="Search Lanes" />
            <QuickActionButton icon={Users} label="Compare Carriers" />
            <QuickActionButton icon={DollarSign} label="Margin Analysis" />
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-white mb-3">Top Lanes This Week</h3>
            <div className="space-y-2">
              {[
                { lane: 'CHT → Columbus, OH', count: 8 },
                { lane: 'CHT → Chicago, IL', count: 6 },
                { lane: 'CHT → Dallas, TX', count: 5 },
                { lane: 'CHT → Denver, CO', count: 4 },
              ].map((l) => (
                <div key={l.lane} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate">{l.lane}</span>
                  <span className="text-white font-semibold ml-2 flex-shrink-0">{l.count} loads</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface KPICardProps {
  title: string
  value: string
  change: number
  icon: React.ComponentType<{ className?: string }>
  trend: 'up' | 'down' | 'neutral'
}

function KPICard({ title, value, change, icon: Icon, trend }: KPICardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend !== 'neutral' && (
          <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded ${
            trend === 'up' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-muted-foreground text-sm mt-1">{title}</p>
      </div>
    </div>
  )
}

interface QuickActionButtonProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
}

function QuickActionButton({ icon: Icon, label }: QuickActionButtonProps) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium text-white">{label}</span>
    </button>
  )
}

