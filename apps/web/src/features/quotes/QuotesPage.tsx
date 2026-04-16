import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, MapPin, CheckCircle2, Clock, Truck, XCircle, Search, ChevronDown } from 'lucide-react'
import { quotes } from './quotes.data'

const statusConfig = {
  approved: { label: 'Approved', color: 'text-success bg-success/10',      icon: CheckCircle2 },
  won:      { label: 'Won',      color: 'text-primary bg-primary/10',       icon: Truck        },
  pending:  { label: 'Pending',  color: 'text-warning bg-warning/10',       icon: Clock        },
  lost:     { label: 'Lost',     color: 'text-destructive bg-destructive/10', icon: XCircle     },
}

const STATUS_TABS = ['All', 'Approved', 'Won', 'Pending', 'Lost'] as const
const EQUIPMENT_OPTIONS = ['All', 'RGN', 'Lowboy', 'Flatbed', 'Step-Deck'] as const

const summaryStats = [
  { label: 'This Month',  value: '73',      sub: 'quotes generated' },
  { label: 'Won',         value: '51',      sub: '69.9% win rate'   },
  { label: 'Avg Margin',  value: '18.3%',   sub: '+2.1 pts vs LY'   },
  { label: 'Total Value', value: '$487K',   sub: 'month to date'    },
]

export function QuotesPage() {
  const navigate = useNavigate()

  const [search, setSearch]         = useState('')
  const [statusTab, setStatusTab]   = useState<typeof STATUS_TABS[number]>('All')
  const [equipFilter, setEquipFilter] = useState<typeof EQUIPMENT_OPTIONS[number]>('All')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return quotes.filter((quote) => {
      const matchSearch = !q || [
        quote.id, quote.origin, quote.dest, quote.carrier, quote.equipment,
      ].some((v) => v.toLowerCase().includes(q))

      const matchStatus = statusTab === 'All' || quote.status === statusTab.toLowerCase()
      const matchEquip  = equipFilter === 'All' || quote.equipment === equipFilter

      return matchSearch && matchStatus && matchEquip
    })
  }, [search, statusTab, equipFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Quotes</h1>
        <p className="text-muted-foreground mt-1">Budget estimates and firm freight quotes — Jerome Ave.</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border px-5 py-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            <p className="text-xs text-primary font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quotes table */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h2 className="text-lg font-semibold text-white">All Quotes — April 2026</h2>
          <button onClick={() => navigate('/quotes/new')} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            <FileText className="h-4 w-4" />
            New Quote
          </button>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search quote #, route, carrier…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Equipment filter */}
          <div className="relative">
            <select
              value={equipFilter}
              onChange={(e) => setEquipFilter(e.target.value as typeof EQUIPMENT_OPTIONS[number])}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-secondary border border-border text-sm text-white focus:outline-none focus:border-primary transition-colors"
            >
              {EQUIPMENT_OPTIONS.map((eq) => (
                <option key={eq} value={eq}>{eq === 'All' ? 'All Equipment' : eq}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-1 mb-5">
          {STATUS_TABS.map((tab) => {
            const count = tab === 'All'
              ? quotes.length
              : quotes.filter((q) => q.status === tab.toLowerCase()).length
            return (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusTab === tab
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-white border border-transparent hover:border-border'
                }`}
              >
                {tab} <span className="ml-1 opacity-60">{count}</span>
              </button>
            )
          })}
          {filtered.length !== quotes.length && (
            <span className="ml-auto text-xs text-muted-foreground self-center">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-3">Quote #</th>
                <th className="text-left pb-3">Date</th>
                <th className="text-left pb-3">Route</th>
                <th className="text-left pb-3">Equipment</th>
                <th className="text-right pb-3">Lbs</th>
                <th className="text-right pb-3">Miles</th>
                <th className="text-right pb-3">Budget Rate</th>
                <th className="text-left pb-3 pl-4">Carrier</th>
                <th className="text-right pb-3">Margin</th>
                <th className="text-left pb-3 pl-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                    No quotes match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((q) => {
                  const s = statusConfig[q.status as keyof typeof statusConfig]
                  const SIcon = s.icon
                  return (
                    <tr key={q.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/quotes/${q.id}`)}>
                      <td className="py-3 text-primary text-sm font-mono font-medium">{q.id}</td>
                      <td className="py-3 text-sm text-muted-foreground">{q.date}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm text-white whitespace-nowrap" aria-label={`from ${q.origin} to ${q.dest}`}>{q.origin} → {q.dest}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">{q.equipment}</td>
                      <td className="py-3 text-right text-sm text-muted-foreground">{q.lbs}</td>
                      <td className="py-3 text-right text-sm text-muted-foreground">{q.miles}</td>
                      <td className="py-3 text-right text-sm font-semibold text-white">{q.rate}</td>
                      <td className="py-3 pl-4 text-sm text-muted-foreground">{q.carrier}</td>
                      <td className="py-3 text-right text-sm font-semibold text-success">{q.margin}</td>
                      <td className="py-3 pl-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${s.color}`}>
                          <SIcon className="h-3 w-3" />
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

