import { useParams, useNavigate } from 'react-router-dom'
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
} from 'lucide-react'
import { quotes } from './quotes.data'

const statusConfig = {
  approved: { label: 'Approved', color: 'text-success bg-success/10 border-success/20', icon: CheckCircle2 },
  won:      { label: 'Won',      color: 'text-primary bg-primary/10 border-primary/20',  icon: Truck        },
  pending:  { label: 'Pending',  color: 'text-warning bg-warning/10 border-warning/20',  icon: Clock        },
  lost:     { label: 'Lost',     color: 'text-destructive bg-destructive/10 border-destructive/20', icon: XCircle },
}

export function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const quote = quotes.find((q) => q.id === id)

  if (!quote) {
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

  const s = statusConfig[quote.status as keyof typeof statusConfig]
  const SIcon = s.icon

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
            <h1 className="text-2xl font-bold text-white font-mono">{quote.id}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {quote.date}, April 2026
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${s.color}`}>
            <SIcon className="h-4 w-4" />
            {s.label}
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
              <DetailField label="Origin"     value={quote.origin} />
              <DetailField label="Destination" value={quote.dest} />
              <DetailField label="Miles"       value={quote.miles} />
              <DetailField label="Equipment"   value={quote.equipment} />
              <DetailField label="Weight"      value={`${quote.lbs} lbs`} />
              <DetailField label="Carrier"     value={`${quote.carrier} · MC #${quote.carrierMc}`} />
            </div>
          </div>

          {/* Rate breakdown */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Rate Breakdown
            </h2>
            <div className="space-y-3">
              <RateRow label="Base Linehaul Rate" value={quote.baseRate} />
              <RateRow label="Fuel Surcharge"      value={quote.fuelSurcharge} />
              <RateRow label="Accessorials"        value={quote.accessorials} />
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-sm font-bold text-white">Total Budget Rate</span>
                <span className="text-xl font-bold text-white">{quote.rate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">IPS Freight Margin</span>
                <span className="text-sm font-bold text-success">{quote.margin}</span>
              </div>
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

        {/* Right: timeline */}
        <div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Activity Timeline
            </h2>
            <ol className="space-y-4">
              {quote.timeline.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1 flex-shrink-0" />
                    {i < quote.timeline.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm text-white">{item.event}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </li>
              ))}
            </ol>
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
