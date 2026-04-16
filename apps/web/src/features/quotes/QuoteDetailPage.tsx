import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  MapPin,
  Truck,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Package,
  Calendar,
  Loader2,
} from 'lucide-react'
import { quotesApi, type ApiQuoteDetail } from '../../lib/api'

const statusConfig: Record<string, { label: string; color: string; icon: typeof Truck }> = {
  CLOSED:            { label: 'Won',      color: 'text-primary bg-primary/10 border-primary/20',       icon: Truck        },
  PENDING:           { label: 'Pending',  color: 'text-warning bg-warning/10 border-warning/20',       icon: Clock        },
  LOST_SALE:         { label: 'Lost',     color: 'text-destructive bg-destructive/10 border-destructive/20', icon: XCircle },
  QUOTED:            { label: 'Approved', color: 'text-success bg-success/10 border-success/20',       icon: CheckCircle2 },
  SIGNED_CONTRACT:   { label: 'Approved', color: 'text-success bg-success/10 border-success/20',       icon: CheckCircle2 },
  CUSTOMER_ARRANGED: { label: 'Approved', color: 'text-success bg-success/10 border-success/20',       icon: CheckCircle2 },
}

function fmtRate(n: number) {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: quote, isLoading, isError } = useQuery<ApiQuoteDetail>({
    queryKey: ['quote', id],
    queryFn:  () => quotesApi.get(id!) as Promise<ApiQuoteDetail>,
    enabled:  !!id,
    retry:    1,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 animate-fade-in">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (isError || !quote) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Quote not found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find quote "{id}".</p>
        <button
          onClick={() => navigate('/quotes')}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </button>
      </div>
    )
  }

  const s = statusConfig[quote.status] ?? statusConfig.PENDING
  const SIcon = s.icon

  // Build equipment summary from qty columns
  const equipParts: string[] = []
  if (quote.flatbedQty > 0)   equipParts.push(`${quote.flatbedQty} Flatbed`)
  if (quote.stepDeckQty > 0)  equipParts.push(`${quote.stepDeckQty} Step-Deck`)
  if (quote.doubleDeckQty > 0) equipParts.push(`${quote.doubleDeckQty} Double`)
  if (quote.towawayQty > 0)   equipParts.push(`${quote.towawayQty} Towaway`)
  if (quote.dollyQty > 0)     equipParts.push(`${quote.dollyQty} Dolly`)
  if (quote.rgnQty > 0)       equipParts.push(`${quote.rgnQty} RGN`)
  const equipmentLabel = equipParts.length > 0 ? equipParts.join(', ') : '—'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + header */}
      <div>
        <button
          onClick={() => navigate('/quotes')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </button>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-mono">{quote.requestNumber}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {fmtDate(quote.quoteDate)}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${s.color}`}>
            <SIcon className="h-4 w-4" />
            {s.label}
          </span>
          <span className="text-xs text-muted-foreground border border-border px-2 py-1 rounded-full">
            {quote.type === 'BUDGET' ? 'Budget' : 'Firm'}
          </span>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: route + rate details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Route card */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Route Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Origin"      value={`${quote.lane.origin.city}, ${quote.lane.origin.state}`} />
              <DetailField label="Destination"  value={`${quote.lane.destination.city}, ${quote.lane.destination.state}`} />
              <DetailField label="Miles"        value={quote.lane.distance?.toLocaleString() ?? '—'} />
              <DetailField label="Equipment"    value={equipmentLabel} />
              <DetailField label="Customer"     value={quote.customer} />
              <DetailField label="Carrier"      value={quote.selectedCarrier?.name ?? '—'} />
            </div>
          </div>

          {/* Rate breakdown */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Rate Breakdown
            </h2>
            <div className="space-y-3">
              <RateRow label="Carrier Cost"       value={fmtRate(quote.carrierTotal)} />
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-sm font-bold text-white">Quote to Customer</span>
                <span className="text-xl font-bold text-white">{fmtRate(quote.quoteToCustomer)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Margin</span>
                <span className="text-sm font-bold text-success">{Math.round(quote.markup * 100)}%</span>
              </div>
              {quote.quoteResult && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Result</span>
                  <span className="text-sm font-medium text-white">{quote.quoteResult}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Notes
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{quote.notes}</p>
            </div>
          )}
        </div>

        {/* Right: Carrier bids */}
        <div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Carrier Bids
            </h2>
            {quote.bids && quote.bids.length > 0 ? (
              <div className="space-y-3">
                {quote.bids.map((bid) => (
                  <div key={bid.id} className={`p-3 rounded-lg border ${bid.isSelected ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{bid.carrier.name}</span>
                      {bid.isSelected && (
                        <span className="text-xs text-primary font-medium">Selected</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-semibold text-white">{bid.totalRate > 0 ? fmtRate(bid.totalRate) : '—'}</span>
                      {bid.carrier.mcNumber && (
                        <span className="text-xs text-muted-foreground">MC #{bid.carrier.mcNumber}</span>
                      )}
                    </div>
                    {(bid.equipmentRating || bid.responseRating || bid.serviceRating) && (
                      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                        {bid.equipmentRating && <span>Equip: {bid.equipmentRating}/5</span>}
                        {bid.responseRating && <span>Resp: {bid.responseRating}/5</span>}
                        {bid.serviceRating && <span>Svc: {bid.serviceRating}/5</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No carrier bids recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  )
}

function RateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  )
}
