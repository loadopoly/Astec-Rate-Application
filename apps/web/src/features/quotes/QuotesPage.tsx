import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileText, MapPin, CheckCircle2, Clock, Truck, XCircle, Upload, Search, ChevronDown } from 'lucide-react'
import { quotesApi, type ApiQuote } from '../../lib/api'

const statusConfig: Record<string, { label: string; color: string; icon: typeof Truck }> = {
  approved:   { label: 'Approved', color: 'text-success bg-success/10',        icon: CheckCircle2 },
  won:        { label: 'Won',      color: 'text-primary bg-primary/10',         icon: Truck        },
  pending:    { label: 'Pending',  color: 'text-warning bg-warning/10',         icon: Clock        },
  lost:       { label: 'Lost',     color: 'text-destructive bg-destructive/10', icon: XCircle     },
  CLOSED:           { label: 'Won',      color: 'text-primary bg-primary/10',         icon: Truck        },
  PENDING:          { label: 'Pending',  color: 'text-warning bg-warning/10',         icon: Clock        },
  LOST_SALE:        { label: 'Lost',     color: 'text-destructive bg-destructive/10', icon: XCircle     },
  QUOTED:           { label: 'Approved', color: 'text-success bg-success/10',         icon: CheckCircle2 },
  SIGNED_CONTRACT:  { label: 'Approved', color: 'text-success bg-success/10',         icon: CheckCircle2 },
  CUSTOMER_ARRANGED:{ label: 'Approved', color: 'text-success bg-success/10',         icon: CheckCircle2 },
}

const STATUS_TABS = ['All', 'Won', 'Approved', 'Pending', 'Lost'] as const

function fmtRate(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Map API status to the tab label it belongs to */
function statusToTab(status: string): string {
  switch (status) {
    case 'CLOSED':            return 'Won'
    case 'PENDING':           return 'Pending'
    case 'LOST_SALE':         return 'Lost'
    case 'QUOTED':
    case 'SIGNED_CONTRACT':
    case 'CUSTOMER_ARRANGED': return 'Approved'
    default:                  return 'Pending'
  }
}

export function QuotesPage() {
  const navigate = useNavigate()

  const { data: quotes, isLoading, isError } = useQuery<ApiQuote[]>({
    queryKey: ['quotes'],
    queryFn:  quotesApi.list,
    retry:    1,
  })

  const hasData = Array.isArray(quotes) && quotes.length > 0

  // Search & filter state
  const [search, setSearch]       = useState('')
  const [statusTab, setStatusTab] = useState<typeof STATUS_TABS[number]>('All')

  // Filtered list
  const filtered = useMemo(() => {
    if (!hasData) return []
    const q = search.toLowerCase()
    return quotes!.filter((quote) => {
      const matchSearch = !q || [
        quote.requestNumber,
        `${quote.lane.origin.city}, ${quote.lane.origin.state}`,
        `${quote.lane.destination.city}, ${quote.lane.destination.state}`,
        quote.selectedCarrier?.name ?? '',
        quote.customer ?? '',
      ].some((v) => v.toLowerCase().includes(q))

      const matchStatus = statusTab === 'All' || statusToTab(quote.status) === statusTab

      return matchSearch && matchStatus
    })
  }, [quotes, hasData, search, statusTab])

  // Compute summary stats from live data
  const totalQuotes = quotes?.length ?? 0
  const wonQuotes   = quotes?.filter(q => q.status === 'CLOSED').length ?? 0
  const winRate     = totalQuotes > 0 ? Math.round((wonQuotes / totalQuotes) * 100 * 10) / 10 : 0
  const avgMargin   = totalQuotes > 0
    ? Math.round(quotes!.reduce((s, q) => s + q.markup, 0) / totalQuotes * 100 * 10) / 10
    : 0
  const totalValue  = Math.round((quotes ?? []).reduce((s, q) => s + q.quoteToCustomer, 0))

  const summaryStats = hasData
    ? [
        { label: 'Total Quotes', value: totalQuotes.toString(),                          sub: 'in database'  },
        { label: 'Won',          value: `${wonQuotes}`,                                  sub: `${winRate}% win rate` },
        { label: 'Avg Margin',   value: `${avgMargin}%`,                                 sub: 'across all quotes' },
        { label: 'Total Value',  value: `$${Math.round(totalValue / 1000)}K`,            sub: 'quote value' },
      ]
    : [
        { label: 'Total Quotes', value: '—', sub: 'no data yet' },
        { label: 'Won',          value: '—', sub: 'no data yet' },
        { label: 'Avg Margin',   value: '—', sub: 'no data yet' },
        { label: 'Total Value',  value: '—', sub: 'no data yet' },
      ]

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
          <h2 className="text-lg font-semibold text-white">All Quotes</h2>
          <button onClick={() => navigate('/quotes/new')} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            <FileText className="h-4 w-4" />
            New Quote
          </button>
        </div>

        {isLoading && (
          <p className="text-muted-foreground text-sm py-12 text-center">Loading quotes…</p>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-destructive text-sm mb-2">Unable to load quotes from the API.</p>
            <p className="text-muted-foreground text-xs">Make sure the API server is running and the database has been seeded or an Excel import has been completed.</p>
          </div>
        )}

        {!isLoading && !isError && !hasData && (
          <div className="text-center py-12">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-white font-medium mb-1">No quotes yet</p>
            <p className="text-muted-foreground text-sm">Import your Excel spreadsheet to load historic data, or create a new quote.</p>
          </div>
        )}

        {hasData && (
          <>
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
            </div>

            {/* Status tabs */}
            <div className="flex flex-wrap gap-1 mb-5">
              {STATUS_TABS.map((tab) => {
                const count = tab === 'All'
                  ? quotes!.length
                  : quotes!.filter((q) => statusToTab(q.status) === tab).length
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
              {filtered.length !== quotes!.length && (
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
                      <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                        No quotes match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((q) => {
                      const s = statusConfig[q.status] ?? statusConfig.PENDING
                      const SIcon = s.icon
                      const margin = q.quoteToCustomer > 0
                        ? Math.round(q.markup * 100) + '%'
                        : '—'
                      return (
                        <tr key={q.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/quotes/${q.requestNumber}`)}>
                          <td className="py-3 text-primary text-sm font-mono font-medium">{q.requestNumber}</td>
                          <td className="py-3 text-sm text-muted-foreground">{fmtDate(q.quoteDate)}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                              <span className="text-sm text-white whitespace-nowrap">
                                {q.lane.origin.city}, {q.lane.origin.state} → {q.lane.destination.city}, {q.lane.destination.state}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-right text-sm text-muted-foreground">{q.lane.distance?.toLocaleString() ?? '—'}</td>
                          <td className="py-3 text-right text-sm font-semibold text-white">{fmtRate(q.quoteToCustomer)}</td>
                          <td className="py-3 pl-4 text-sm text-muted-foreground">{q.selectedCarrier?.name ?? '—'}</td>
                          <td className="py-3 text-right text-sm font-semibold text-success">{margin}</td>
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
          </>
        )}
      </div>
    </div>
  )
}
