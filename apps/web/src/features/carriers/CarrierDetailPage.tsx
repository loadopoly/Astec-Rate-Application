import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, CheckCircle2, Users, Truck, MapPin, Phone, Mail } from 'lucide-react'
import { carriers } from './carriers.data'

export function CarrierDetailPage() {
  const { mc } = useParams<{ mc: string }>()
  const navigate = useNavigate()

  const carrier = carriers.find((c) => c.mc === mc)

  if (!carrier) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Carrier not found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find carrier data for MC #{mc}.</p>
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
              {carrier.preferred && (
                <Star className="h-5 w-5 text-primary fill-primary flex-shrink-0" />
              )}
              <h1 className="text-2xl font-bold text-white">{carrier.name}</h1>
            </div>
            <p className="text-muted-foreground mt-1">MC #{carrier.mc} · DOT #{carrier.dot} · {carrier.type}</p>
          </div>
          {carrier.preferred ? (
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
          { label: 'Win Rate',    value: `${carrier.winRate}%`, color: carrier.winRate >= 70 ? 'text-success' : carrier.winRate >= 55 ? 'text-warning' : 'text-destructive' },
          { label: 'On-Time %',  value: `${carrier.onTime}%`,  color: carrier.onTime >= 95 ? 'text-success' : carrier.onTime >= 90 ? 'text-warning' : 'text-destructive' },
          { label: 'YTD Loads',  value: carrier.ytdLoads.toString(), color: 'text-white' },
          { label: 'YTD Spend',  value: carrier.ytdSpend,      color: 'text-white' },
        ].map((k) => (
          <div key={k.label} className="bg-card rounded-xl border border-border px-5 py-4">
            <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly history + details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly performance table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h2 className="text-base font-semibold text-white mb-4">Monthly Performance — 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3">Month</th>
                  <th className="text-right pb-3">Loads</th>
                  <th className="text-right pb-3">Total Spend</th>
                  <th className="text-right pb-3">On-Time %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {carrier.monthlyHistory.map((m) => (
                  <tr key={m.month} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 text-sm font-medium text-white">{m.month} 2026</td>
                    <td className="py-3 text-right text-sm text-white">{m.loads}</td>
                    <td className="py-3 text-right text-sm font-semibold text-white">{m.spend}</td>
                    <td className="py-3 text-right">
                      <span className={`text-sm font-semibold ${m.onTime >= 95 ? 'text-success' : m.onTime >= 90 ? 'text-warning' : 'text-destructive'}`}>
                        {m.onTime}%
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-border bg-secondary/20">
                  <td className="py-3 text-sm font-bold text-white">YTD Total</td>
                  <td className="py-3 text-right text-sm font-bold text-white">{carrier.ytdLoads}</td>
                  <td className="py-3 text-right text-sm font-bold text-white">{carrier.ytdSpend}</td>
                  <td className="py-3 text-right text-sm font-bold text-success">{carrier.onTime}% avg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Contact
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white">{carrier.contact}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{carrier.email}</span>
              </div>
            </div>
          </div>

          {/* Top lanes */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Top Lanes
            </h2>
            <div className="space-y-2">
              {carrier.topLanes.map((lane, i) => (
                <div key={lane} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <span className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
                  <span className="text-sm text-white">{lane}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment & notes */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Equipment &amp; Notes
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {carrier.equipment.map((eq) => (
                <span key={eq} className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {eq}
                </span>
              ))}
            </div>
            {carrier.notes && (
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-4">
                {carrier.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
