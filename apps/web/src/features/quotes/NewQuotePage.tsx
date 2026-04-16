import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, MapPin, Truck, Package, DollarSign, ChevronDown } from 'lucide-react'

const EQUIPMENT_TYPES = ['RGN', 'Lowboy', 'Flatbed', 'Step-Deck']

const DESTINATIONS = [
  'Atlanta, GA',
  'Chicago, IL',
  'Columbus, OH',
  'Dallas, TX',
  'Denver, CO',
  'Houston, TX',
  'Kansas City, MO',
  'Los Angeles, CA',
  'Minneapolis, MN',
  'Nashville, TN',
  'Phoenix, AZ',
  'Portland, OR',
]

const CARRIERS = [
  { name: 'National Western Transport', mc: '234521' },
  { name: 'Landstar System',            mc: '191956' },
  { name: 'Heavy Haul America',         mc: '487201' },
  { name: 'Anderson Trucking Service',  mc: '318291' },
  { name: 'ArcBest / ABF Freight',      mc: '145421' },
  { name: 'XPO Logistics',              mc: '573098' },
  { name: 'Regional Express Freight',   mc: '612847' },
  { name: 'Estes Express Lines',        mc: '301556' },
]

function nextQuoteId() {
  // Generate a timestamp-based request number
  const now = new Date()
  const seq = String(Math.floor(Math.random() * 9000) + 1000)
  return `CHT-${String(now.getMonth() + 1).padStart(2, '0')}${seq}`
}

export function NewQuotePage() {
  const navigate = useNavigate()

  const [dest, setDest]         = useState('')
  const [equipment, setEquip]   = useState('')
  const [lbs, setLbs]           = useState('')
  const [carrier, setCarrier]   = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [generatedId, setGeneratedId] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = nextQuoteId()
    setGeneratedId(id)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="p-4 rounded-full bg-success/10 mb-6">
          <FileText className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Quote Created</h2>
        <p className="text-muted-foreground mb-1">
          Quote <span className="text-white font-mono font-semibold">{generatedId}</span> has been generated.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          {dest} · {equipment} · {lbs} lbs · {carrier}
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/quotes')}
            className="px-5 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Back to Quotes
          </button>
          <button
            onClick={() => {
              setSubmitted(false)
              setDest('')
              setEquip('')
              setLbs('')
              setCarrier('')
            }}
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors"
          >
            Create Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Back + header */}
      <div>
        <button
          onClick={() => navigate('/quotes')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </button>
        <h1 className="text-2xl font-bold text-white">New Budget Quote</h1>
        <p className="text-muted-foreground mt-1">Generate a new freight budget estimate — Jerome Ave., Chattanooga TN</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-6">

        {/* Origin — always fixed */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> Origin
          </label>
          <div className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-muted-foreground select-none">
            Chattanooga, TN — Jerome Ave. (default)
          </div>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> Destination <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              className="w-full appearance-none px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">Select destination…</option>
              {DESTINATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Equipment type */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> Equipment Type <span className="text-destructive">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_TYPES.map((eq) => (
              <button
                key={eq}
                type="button"
                onClick={() => setEquip(eq)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  equipment === eq
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-secondary border-border text-muted-foreground hover:border-primary/50 hover:text-white'
                }`}
              >
                {eq}
              </button>
            ))}
          </div>
          {/* hidden required input for form validation */}
          <input type="text" required readOnly value={equipment} onChange={(e) => setEquip(e.target.value)} className="sr-only" aria-hidden="true" tabIndex={-1} />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" /> Estimated Weight (lbs) <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            required
            min={1}
            max={200000}
            placeholder="e.g. 80000"
            value={lbs}
            onChange={(e) => setLbs(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Preferred carrier */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5" /> Preferred Carrier (optional)
          </label>
          <div className="relative">
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="w-full appearance-none px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">No preference — use best available</option>
              {CARRIERS.map((c) => (
                <option key={c.mc} value={c.name}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => navigate('/quotes')}
            className="px-5 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Generate Quote
          </button>
        </div>
      </form>
    </div>
  )
}
