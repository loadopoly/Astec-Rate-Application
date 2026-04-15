import { FileText, MapPin, CheckCircle2, Clock, AlertCircle, Truck, XCircle } from 'lucide-react'

const quotes = [
  { id: 'CHT-0847', date: 'Apr 15', origin: 'Chattanooga, TN', dest: 'Denver, CO',       equipment: 'RGN',       lbs: '85,000', miles: '1,648', rate: '$8,400',  carrier: 'Natl Western',  margin: '21%', status: 'approved' },
  { id: 'CHT-0846', date: 'Apr 14', origin: 'Chattanooga, TN', dest: 'Phoenix, AZ',      equipment: 'Lowboy',    lbs: '92,000', miles: '1,979', rate: '$9,200',  carrier: 'Landstar',      margin: '18%', status: 'won'      },
  { id: 'CHT-0845', date: 'Apr 14', origin: 'Chattanooga, TN', dest: 'Columbus, OH',     equipment: 'Flatbed',   lbs: '45,000', miles: '424',   rate: '$3,800',  carrier: 'ArcBest',       margin: '22%', status: 'pending'  },
  { id: 'CHT-0844', date: 'Apr 12', origin: 'Chattanooga, TN', dest: 'Dallas, TX',       equipment: 'RGN',       lbs: '78,000', miles: '669',   rate: '$7,100',  carrier: 'Anderson',      margin: '19%', status: 'approved' },
  { id: 'CHT-0843', date: 'Apr 11', origin: 'Chattanooga, TN', dest: 'Portland, OR',     equipment: 'Lowboy',    lbs: '110,000', miles: '2,389', rate: '$11,800', carrier: 'Natl Western',  margin: '15%', status: 'won'      },
  { id: 'CHT-0842', date: 'Apr 11', origin: 'Chattanooga, TN', dest: 'Chicago, IL',      equipment: 'Step-Deck', lbs: '38,000', miles: '480',   rate: '$3,200',  carrier: 'Estes',         margin: '24%', status: 'pending'  },
  { id: 'CHT-0841', date: 'Apr 10', origin: 'Chattanooga, TN', dest: 'Houston, TX',      equipment: 'RGN',       lbs: '95,000', miles: '834',   rate: '$8,700',  carrier: 'Anderson',      margin: '20%', status: 'approved' },
  { id: 'CHT-0840', date: 'Apr 10', origin: 'Chattanooga, TN', dest: 'Atlanta, GA',      equipment: 'Flatbed',   lbs: '42,000', miles: '118',   rate: '$2,100',  carrier: 'Regional Exp.',  margin: '28%', status: 'won'      },
  { id: 'CHT-0839', date: 'Apr 9',  origin: 'Chattanooga, TN', dest: 'Kansas City, MO',  equipment: 'Step-Deck', lbs: '51,000', miles: '621',   rate: '$4,650',  carrier: 'Landstar',      margin: '17%', status: 'lost'     },
  { id: 'CHT-0838', date: 'Apr 8',  origin: 'Chattanooga, TN', dest: 'Los Angeles, CA',  equipment: 'Lowboy',    lbs: '88,000', miles: '2,180', rate: '$10,400', carrier: 'XPO Logistics',  margin: '16%', status: 'won'      },
  { id: 'CHT-0837', date: 'Apr 7',  origin: 'Chattanooga, TN', dest: 'Minneapolis, MN',  equipment: 'RGN',       lbs: '74,000', miles: '817',   rate: '$6,900',  carrier: 'Heavy Haul USA', margin: '23%', status: 'approved' },
  { id: 'CHT-0836', date: 'Apr 7',  origin: 'Chattanooga, TN', dest: 'Nashville, TN',    equipment: 'Flatbed',   lbs: '36,000', miles: '134',   rate: '$1,950',  carrier: 'Regional Exp.',  margin: '31%', status: 'won'      },
]

const statusConfig = {
  approved: { label: 'Approved', color: 'text-success bg-success/10',      icon: CheckCircle2 },
  won:      { label: 'Won',      color: 'text-primary bg-primary/10',       icon: Truck        },
  pending:  { label: 'Pending',  color: 'text-warning bg-warning/10',       icon: Clock        },
  lost:     { label: 'Lost',     color: 'text-destructive bg-destructive/10', icon: XCircle     },
}

const summaryStats = [
  { label: 'This Month',  value: '73',      sub: 'quotes generated' },
  { label: 'Won',         value: '51',      sub: '69.9% win rate'   },
  { label: 'Avg Margin',  value: '18.3%',   sub: '+2.1 pts vs LY'   },
  { label: 'Total Value', value: '$487K',   sub: 'month to date'    },
]

export function QuotesPage() {
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
          <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
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
              {quotes.map((q) => {
                const s = statusConfig[q.status as keyof typeof statusConfig]
                const SIcon = s.icon
                return (
                  <tr key={q.id} className="hover:bg-secondary/30 transition-colors cursor-pointer">
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

