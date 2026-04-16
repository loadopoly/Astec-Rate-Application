import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Star, CheckCircle2, Users, Truck, MapPin, Phone, Mail, Loader2 } from 'lucide-react'
import { carriersApi, type ApiCarrierDetail } from '../../lib/api'

function fmtRate(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function CarrierDetailPage() {
  const { mc } = useParams<{ mc: string }>()
  const navigate = useNavigate()

  const { data: carrier, isLoading, isError } = useQuery<ApiCarrierDetail>({
    queryKey: ['carrier', mc],
    queryFn:  () => carriersApi.get(mc!) as Promise<ApiCarrierDetail>,
    enabled:  !!mc,
    retry:    1,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 animate-fade-in">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (isError || !carrier) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Carrier not found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find carrier data for "{mc}".</p>
        <button
          onClick={() => navigate('/carriers')}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Carriers
        </button>
      </div>
    )
  }

  // Compute stats from performance data
  const totalBids  = carrier.performance.reduce((s, p) => s + p.totalBids, 0)
  const totalWon   = carrier.performance.reduce((s, p) => s + p.wonBids, 0)
  const winRate    = totalBids > 0 ? Math.round((totalWon / totalBids) * 100) : 0
  const avgOnTime  = carrier.performance.length > 0
    ? Math.round(carrier.performance.reduce((s, p) => s + (p.onTimeDelivery ?? 0), 0) / carrier.performance.length)
    : 0

  // Recent bids (quotes this carrier was involved in)
  const recentBids = carrier.bids ?? []

  // Primary contact
  const primaryContact = carrier.contacts?.find(c => c.isPrimary) ?? carrier.contacts?.[0]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + header */}
      <div>
        <button
          onClick={() => navigate('/carriers')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Carriers
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              {carrier.isPreferred && (
                <Star className="h-5 w-5 text-primary fill-primary flex-shrink-0" />
              )}
              <h1 className="text-2xl font-bold text-white">{carrier.name}</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              {carrier.mcNumber ? `MC #${carrier.mcNumber}` : ''}
              {carrier.dotNumber ? ` · DOT #${carrier.dotNumber}` : ''}
              {carrier.type ? ` · ${carrier.type}` : ''}
            </p>
          </div>
          {carrier.isPreferred ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="h-4 w-4" />
              Preferred Carrier
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-secondary border border-border px-3 py-1.5 rounded-full">
              Active
            </span>
          )}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Win Rate',    value: totalBids > 0 ? `${winRate}%` : '—', color: winRate >= 70 ? 'text-success' : winRate >= 55 ? 'text-warning' : 'text-destructive' },
          { label: 'On-Time %',  value: avgOnTime > 0 ? `${avgOnTime}%` : '—', color: avgOnTime >= 95 ? 'text-success' : avgOnTime >= 90 ? 'text-warning' : 'text-destructive' },
          { label: 'Total Bids',  value: totalBids > 0 ? totalBids.toString() : '—', color: 'text-white' },
          { label: 'Won',         value: totalWon > 0 ? totalWon.toString() : '—', color: 'text-white' },
        ].map((k) => (
          <div key={k.label} className="bg-card rounded-xl border border-border px-5 py-4">
            <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Performance + details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-white mb-4">Recent Quotes</h2>
          {recentBids.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3">Quote #</th>
                    <th className="text-left pb-3">Route</th>
                    <th className="text-left pb-3">Date</th>
                    <th className="text-right pb-3">Bid</th>
                    <th className="text-left pb-3 pl-4">Selected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentBids.map((bid) => (
                    <tr key={bid.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/quotes/${bid.quote.requestNumber}`)}>
                      <td className="py-3 text-primary text-sm font-mono">{bid.quote.requestNumber}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-white truncate max-w-[180px]">
                            {bid.quote.lane.origin.city}, {bid.quote.lane.origin.state} → {bid.quote.lane.destination.city}, {bid.quote.lane.destination.state}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">{fmtDate(bid.quote.quoteDate)}</td>
                      <td className="py-3 text-right text-sm font-semibold text-white">{bid.totalRate > 0 ? fmtRate(bid.totalRate) : '—'}</td>
                      <td className="py-3 pl-4">
                        {bid.isSelected ? (
                          <span className="text-xs font-medium text-primary">✓ Yes</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-6 text-center">No quote history for this carrier yet.</p>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Contact info */}
          {primaryContact && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Contact
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white">{primaryContact.name}{primaryContact.phone ? ` — ${primaryContact.phone}` : ''}</span>
                </div>
                {primaryContact.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{primaryContact.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Equipment & notes */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Details
            </h2>
            <div className="space-y-3">
              <DetailRow label="Type" value={carrier.type} />
              {carrier.mcNumber && <DetailRow label="MC Number" value={carrier.mcNumber} />}
              {carrier.dotNumber && <DetailRow label="DOT Number" value={carrier.dotNumber} />}
            </div>
            {carrier.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">{carrier.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-muted-foreground flex-shrink-0">{label}</span>
      <span className="text-sm text-white text-right">{value}</span>
    </div>
  )
}
