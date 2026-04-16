import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, FileText, MapPin, Truck, Package, DollarSign,
  ChevronDown, User, AlertTriangle, StickyNote, Calendar, Edit3,
} from 'lucide-react'

const EQUIPMENT_TYPES = ['RGN', 'Lowboy', 'Flatbed', 'Step-Deck']

const PRESET_ORIGINS = [
  'Chattanooga, TN — Jerome Ave. (default)',
  'Chattanooga, TN — Amnicola Hwy.',
  'Cleveland, TN',
  'Dalton, GA',
  'Knoxville, TN',
]

const PRESET_DESTINATIONS = [
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

  // Origin
  const [originMode, setOriginMode] = useState<'preset' | 'manual'>('preset')
  const [originPreset, setOriginPreset] = useState(PRESET_ORIGINS[0])
  const [originManual, setOriginManual] = useState('')

  // Destination
  const [destMode, setDestMode] = useState<'preset' | 'manual'>('preset')
  const [destPreset, setDestPreset] = useState('')
  const [destManual, setDestManual] = useState('')

  // Freight details
  const [equipment, setEquip]     = useState('')
  const [lbs, setLbs]             = useState('')
  const [dims, setDims]           = useState({ l: '', w: '', h: '' })
  const [pickupDate, setPickupDate] = useState('')
  const [commodity, setCommodity] = useState('')
  const [carrier, setCarrier]     = useState('')
  const [customer, setCustomer]   = useState('')
  const [hazmat, setHazmat]       = useState(false)
  const [notes, setNotes]         = useState('')

  const [submitted, setSubmitted]     = useState(false)
  const [generatedId, setGeneratedId] = useState('')

  const effectiveOrigin = originMode === 'preset' ? originPreset : originManual
  const effectiveDest   = destMode   === 'preset' ? destPreset   : destManual

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = nextQuoteId()
    setGeneratedId(id)
    setSubmitted(true)
  }

  function handleReset() {
    setSubmitted(false)
    setOriginMode('preset')
    setOriginPreset(PRESET_ORIGINS[0])
    setOriginManual('')
    setDestMode('preset')
    setDestPreset('')
    setDestManual('')
    setEquip('')
    setLbs('')
    setDims({ l: '', w: '', h: '' })
    setPickupDate('')
    setCommodity('')
    setCarrier('')
    setCustomer('')
    setHazmat(false)
    setNotes('')
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
        <p className="text-sm text-muted-foreground mb-1">
          {effectiveOrigin} → {effectiveDest}
        </p>
        <p className="text-sm text-muted-foreground mb-2">
          {equipment} · {lbs} lbs{hazmat ? ' · ⚠ HAZMAT' : ''}{carrier ? ` · ${carrier}` : ''}
        </p>
        {customer && (
          <p className="text-sm text-muted-foreground mb-2">Customer: {customer}</p>
        )}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => navigate('/quotes')}
            className="px-5 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Back to Quotes
          </button>
          <button
            onClick={handleReset}
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
        <p className="text-muted-foreground mt-1">Generate a new freight budget estimate</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-6">

        {/* ── SECTION: Route ── */}
        <SectionHeader icon={<MapPin className="h-4 w-4 text-primary" />} title="Route" />

        {/* Origin */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Origin
            </label>
            <ModeToggle mode={originMode} onChange={setOriginMode} />
          </div>
          {originMode === 'preset' ? (
            <div className="relative">
              <select
                value={originPreset}
                onChange={(e) => setOriginPreset(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white focus:outline-none focus:border-primary transition-colors"
              >
                {PRESET_ORIGINS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          ) : (
            <input
              type="text"
              required
              placeholder="e.g. Memphis, TN or 123 Main St, Nashville TN"
              value={originManual}
              onChange={(e) => setOriginManual(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          )}
        </div>

        {/* Destination */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Destination <span className="text-destructive ml-1">*</span>
            </label>
            <ModeToggle mode={destMode} onChange={setDestMode} />
          </div>
          {destMode === 'preset' ? (
            <div className="relative">
              <select
                required
                value={destPreset}
                onChange={(e) => setDestPreset(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Select destination…</option>
                {PRESET_DESTINATIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          ) : (
            <input
              type="text"
              required
              placeholder="e.g. Seattle, WA or 456 Industrial Blvd, Tucson AZ"
              value={destManual}
              onChange={(e) => setDestManual(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          )}
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Pickup Date (optional)
          </label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* ── SECTION: Freight ── */}
        <SectionHeader icon={<Package className="h-4 w-4 text-primary" />} title="Freight Details" />

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
          <input type="text" required readOnly value={equipment} onChange={(e) => setEquip(e.target.value)} className="sr-only" aria-hidden="true" tabIndex={-1} />
        </div>

        {/* Commodity */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" /> Commodity Description (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Industrial crane, heavy machinery, steel coils"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
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

        {/* Dimensions */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" /> Dimensions — L × W × H (ft, optional)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['l', 'w', 'h'] as const).map((axis) => (
              <input
                key={axis}
                type="number"
                min={0}
                placeholder={axis.toUpperCase()}
                value={dims[axis]}
                onChange={(e) => setDims((d) => ({ ...d, [axis]: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Hazmat */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hazmat}
              onChange={(e) => setHazmat(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" />
              Hazardous Materials (HAZMAT)
            </span>
          </label>
        </div>

        {/* ── SECTION: Customer & Carrier ── */}
        <SectionHeader icon={<User className="h-4 w-4 text-primary" />} title="Customer & Carrier" />

        {/* Customer */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> Customer / Contact Name (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Acme Manufacturing — John Smith"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
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

        {/* ── SECTION: Notes ── */}
        <SectionHeader icon={<StickyNote className="h-4 w-4 text-primary" />} title="Notes" />

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Edit3 className="h-3.5 w-3.5" /> Special Requirements / Notes (optional)
          </label>
          <textarea
            rows={3}
            placeholder="Permits needed, escort required, docking restrictions, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
          />
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

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-1 border-b border-border">
      {icon}
      <span className="text-sm font-semibold text-white">{title}</span>
    </div>
  )
}

function ModeToggle({ mode, onChange }: { mode: 'preset' | 'manual'; onChange: (m: 'preset' | 'manual') => void }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        type="button"
        onClick={() => onChange('preset')}
        className={`px-2 py-0.5 rounded transition-colors ${mode === 'preset' ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground hover:text-white'}`}
      >
        Preset
      </button>
      <span className="text-muted-foreground">/</span>
      <button
        type="button"
        onClick={() => onChange('manual')}
        className={`px-2 py-0.5 rounded transition-colors ${mode === 'manual' ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground hover:text-white'}`}
      >
        Manual
      </button>
    </div>
  )
}
