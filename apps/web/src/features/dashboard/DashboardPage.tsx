/**
 * Dashboard Page — Operations overview driven by live database data
 */

import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Truck,
  MapPin,
  TrendingUp,
  Users,
  FileText,
  ArrowUpRight,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { statsApi, type DashboardStats, type ApiQuote } from '../../lib/api'

const statusConfig: Record<string, { label: string; color: string; icon: typeof Truck }> = {
  CLOSED:            { label: 'Won',      color: 'text-primary bg-primary/10',         icon: Truck        },
  PENDING:           { label: 'Pending',  color: 'text-warning bg-warning/10',         icon: Clock        },
  LOST_SALE:         { label: 'Lost',     color: 'text-destructive bg-destructive/10', icon: AlertCircle  },
  QUOTED:            { label: 'Approved', color: 'text-success bg-success/10',         icon: CheckCircle2 },
  SIGNED_CONTRACT:   { label: 'Approved', color: 'text-success bg-success/10',         icon: CheckCircle2 },
  CUSTOMER_ARRANGED: { label: 'Approved', color: 'text-success bg-success/10',         icon: CheckCircle2 },
}

function fmtRate(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function DashboardPage() {
  const navigate = useNavigate()

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn:  statsApi.dashboard,
    retry:    1,
  })

  const kpis = stats?.kpis
  const recentQuotes: ApiQuote[] = stats?.recentQuotes ?? []
  const topLanes = stats?.topLanes ?? []

  const kpiCards = [
    { title: 'Quotes This Month', value: kpis ? kpis.totalQuotes.toString() : '—', icon: FileText },
    { title: 'Avg. Margin',       value: kpis ? `${kpis.avgMargin}%`         : '—', icon: TrendingUp },
    { title: 'Total Value',       value: kpis ? fmtRate(kpis.totalValue)     : '—', icon: DollarSign },
    { title: 'Active Carriers',   value: kpis ? kpis.activeCarriers.toString(): '—', icon: Users },
  ]

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Operations Dashboard</h1>
          <p className="text-muted-foreground mt-1">Jerome Ave. Heavy Haul — Freight Management</p>
        </div>
        {kpis && kpis.totalQuotes > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-success/10 border border-success/20">
            <TrendingUp className="h-5 w-5 text-success flex-shrink-0" />
            <p className="text-sm text-success font-medium">
              {kpis.wonQuotes} of {kpis.totalQuotes} quotes won this month — <span className="font-bold">{kpis.winRate}%</span> win rate.
            </p>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => (
          <KPICard key={kpi.title} title={kpi.title} value={kpi.value} icon={kpi.icon} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quotes Table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Recent Quotes</h2>
            {kpis && <span className="text-xs text-muted-foreground">Latest {recentQuotes.length} of {kpis.totalQuotes}</span>}
          </div>

          {recentQuotes.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No quotes to display. Import data or create a new quote to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3">Quote #</th>
                    <th className="text-left pb-3">Route</th>
                    <th className="text-right pb-3">Rate</th>
                    <th className="text-right pb-3">Margin</th>
                    <th className="text-left pb-3 pl-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentQuotes.map((q) => {
                    const s = statusConfig[q.status] ?? statusConfig.PENDING
                    const SIcon = s.icon
                    return (
                      <tr key={q.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/quotes/${q.requestNumber}`)}>
                        <td className="py-3 text-primary text-sm font-mono">{q.requestNumber}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-white truncate max-w-[160px]">
                              {q.lane.origin.city}, {q.lane.origin.state} → {q.lane.destination.city}, {q.lane.destination.state}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-sm font-semibold text-white">{fmtRate(q.quoteToCustomer)}</td>
                        <td className="py-3 text-right text-sm font-semibold text-success">{Math.round(q.markup * 100)}%</td>
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
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <QuickActionButton icon={FileText}   label="New Budget Quote"  onClick={() => navigate('/quotes/new')} />
            <QuickActionButton icon={MapPin}     label="Search Lanes"      onClick={() => navigate('/lanes')} />
            <QuickActionButton icon={Users}      label="Compare Carriers"  onClick={() => navigate('/carriers')} />
            <QuickActionButton icon={DollarSign} label="Margin Analysis"   onClick={() => navigate('/analytics')} />
          </div>

          {topLanes.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-white mb-3">Top Lanes This Week</h3>
              <div className="space-y-2">
                {topLanes.map((l) => (
                  <div key={l.lane} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">{l.lane}</span>
                    <span className="text-white font-semibold ml-2 flex-shrink-0">{l.count} loads</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface KPICardProps {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}

function KPICard({ title, value, icon: Icon }: KPICardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
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
  onClick?: () => void
}

function QuickActionButton({ icon: Icon, label, onClick }: QuickActionButtonProps) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium text-white">{label}</span>
    </button>
  )
}
