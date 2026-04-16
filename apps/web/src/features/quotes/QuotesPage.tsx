import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileText, MapPin, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react'
import { quotes as staticQuotes } from './quotes.data'
import { quotesApi, type ApiQuote } from '../../lib/api'

const statusConfig = {
  approved:   { label: 'Approved', color: 'text-success bg-success/10',        icon: CheckCircle2 },
  won:        { label: 'Won',      color: 'text-primary bg-primary/10',         icon: Truck        },
  pending:    { label: 'Pending',  color: 'text-warning bg-warning/10',         icon: Clock        },
  lost:       { label: 'Lost',     color: 'text-destructive bg-destructive/10', icon: XCircle     },
  // DB enum values
  CLOSED:           { label: 'Won',      color: 'text-primary bg-primary/10',         icon: Truck        },
  PENDING:          { label: 'Pending',  color: 'text-warning bg-warning/10',         icon: Clock        },
  LOST_SALE:        { label: 'Lost',     color: 'text-destructive bg-destructive/10', icon: XCircle     },
  QUOTED:           { label: 'Approved', color: 'text-success bg-success/10',         icon: CheckCircle2 },
  SIGNED_CONTRACT:  { label: 'Approved', color: 'text-success bg-success/10',         icon: CheckCircle2 },
  CUSTOMER_ARRANGED:{ label: 'Approved', color: 'text-success bg-success/10',         icon: CheckCircle2 },
}

const summaryStats = [
  { label: 'This Month',  value: '73',      sub: 'quotes generated' },
  { label: 'Won',         value: '51',      sub: '69.9% win rate'   },
  { label: 'Avg Margin',  value: '18.3%',   sub: '+2.1 pts vs LY'   },
  { label: 'Total Value', value: '$487K',   sub: 'month to date'    },
]

function fmtRate(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function QuotesPage() {
  const navigate = useNavigate()

  const { data: apiQuotes } = useQuery<ApiQuote[]>({
    queryKey: ['quotes'],
    queryFn:  quotesApi.list,
    retry:    false,
  })

  // Prefer live DB data; fall back to static mock data when API is unavailable
  const usingApi = Array.isArray(apiQuotes) && apiQuotes.length > 0

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
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">All Quotes — April 2026</h2>
          <button onClick={() => navigate('/quotes/new')} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            <FileText className="h-4 w-4" />
            New Quote
          </button>
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
              {usingApi
                ? apiQuotes.map((q) => {
                    const statusKey = q.status as keyof typeof statusConfig
                    const s = statusConfig[statusKey] ?? statusConfig.PENDING
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
                : staticQuotes.map((q) => {
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
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

