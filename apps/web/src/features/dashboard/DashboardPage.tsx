/**
 * Dashboard Page
 * 
 * Main operational dashboard with KPIs, recent activity, and quick actions.
 */

import { 
  Truck, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Users, 
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

export function DashboardPage() {
  // TODO: Replace with real data from API
  const kpis = {
    totalQuotes: 847,
    quotesChange: 12.5,
    avgMargin: 18.3,
    marginChange: 2.1,
    activeLanes: 77,
    lanesChange: 5,
    carriers: 21,
    carriersChange: 0,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Operations Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Jerome Ave. Heavy Haul Freight Management
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Quotes"
          value={kpis.totalQuotes.toLocaleString()}
          change={kpis.quotesChange}
          icon={FileText}
          trend="up"
        />
        <KPICard
          title="Avg. Margin"
          value={`${kpis.avgMargin}%`}
          change={kpis.marginChange}
          icon={TrendingUp}
          trend="up"
        />
        <KPICard
          title="Active Lanes"
          value={kpis.activeLanes.toString()}
          change={kpis.lanesChange}
          icon={MapPin}
          trend="up"
        />
        <KPICard
          title="Carriers"
          value={kpis.carriers.toString()}
          change={kpis.carriersChange}
          icon={Users}
          trend="neutral"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quotes */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Quotes</h2>
          <div className="text-muted-foreground text-sm">
            <p>Coming soon: List of recent quote activity</p>
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
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quote Volume Trend</h2>
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            <p>Coming soon: Line chart of quote volume over time</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Carrier Win Rate</h2>
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            <p>Coming soon: Bar chart of carrier performance</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// KPI Card Component
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
            trend === 'up' 
              ? 'bg-success/20 text-success' 
              : 'bg-destructive/20 text-destructive'
          }`}>
            {trend === 'up' ? (
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-0.5" />
            )}
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

// Quick Action Button
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
