import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Users, ChevronDown, CheckCircle2, Truck, Phone, Mail,
  FileText, Star,
} from 'lucide-react'

const CARRIER_TYPES = ['Asset', 'Broker', 'Asset/Broker']
const EQUIPMENT_OPTIONS = ['RGN', 'Lowboy', 'Flatbed', 'Step-Deck', 'Dry Van', 'Reefer', 'Tanker']

export function AddCarrierPage() {
  const navigate = useNavigate()

  const [name, setName]             = useState('')
  const [mc, setMc]                 = useState('')
  const [dot, setDot]               = useState('')
  const [type, setType]             = useState('')
  const [contact, setContact]       = useState('')
  const [phone, setPhone]           = useState('')
  const [email, setEmail]           = useState('')
  const [equipment, setEquipment]   = useState<string[]>([])
  const [preferred, setPreferred]   = useState(false)
  const [notes, setNotes]           = useState('')
  const [submitted, setSubmitted]   = useState(false)

  function toggleEquipment(eq: string) {
    setEquipment((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="p-4 rounded-full bg-success/10 mb-6">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Carrier Added</h2>
        <p className="text-muted-foreground mb-1">
          <span className="text-white font-semibold">{name}</span> has been added to the roster.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          MC #{mc} · {type}{preferred ? ' · ⭐ Preferred' : ''}
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/carriers')}
            className="px-5 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Back to Carriers
          </button>
          <button
            onClick={() => {
              setName(''); setMc(''); setDot(''); setType(''); setContact('')
              setPhone(''); setEmail(''); setEquipment([]); setPreferred(false)
              setNotes(''); setSubmitted(false)
            }}
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors"
          >
            Add Another
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
          onClick={() => navigate('/carriers')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Carriers
        </button>
        <h1 className="text-2xl font-bold text-white">Add Carrier</h1>
        <p className="text-muted-foreground mt-1">Register a new carrier to the active roster</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-6">

        {/* ── SECTION: Identity ── */}
        <SectionHeader icon={<Users className="h-4 w-4 text-primary" />} title="Carrier Identity" />

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Carrier Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Acme Freight Inc."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* MC & DOT */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              MC # <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 123456"
              value={mc}
              onChange={(e) => setMc(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              DOT #
            </label>
            <input
              type="text"
              placeholder="e.g. 987654"
              value={dot}
              onChange={(e) => setDot(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Carrier Type */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Carrier Type <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full appearance-none px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">Select type…</option>
              {CARRIER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* ── SECTION: Contact ── */}
        <SectionHeader icon={<Phone className="h-4 w-4 text-primary" />} title="Contact Information" />

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Contact Name
          </label>
          <input
            type="text"
            placeholder="e.g. John Smith"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <Phone className="h-3 w-3" /> Phone
            </label>
            <input
              type="tel"
              placeholder="(423) 555-0100"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <Mail className="h-3 w-3" /> Email
            </label>
            <input
              type="email"
              placeholder="dispatch@carrier.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* ── SECTION: Equipment & Preferences ── */}
        <SectionHeader icon={<Truck className="h-4 w-4 text-primary" />} title="Equipment & Preferences" />

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Equipment Types Operated
          </label>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((eq) => (
              <button
                key={eq}
                type="button"
                onClick={() => toggleEquipment(eq)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  equipment.includes(eq)
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-secondary border-border text-muted-foreground hover:border-primary/50 hover:text-white'
                }`}
              >
                {eq}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={preferred}
              onChange={(e) => setPreferred(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-primary" />
              Mark as Preferred Carrier
            </span>
          </label>
        </div>

        {/* ── SECTION: Notes ── */}
        <SectionHeader icon={<FileText className="h-4 w-4 text-primary" />} title="Notes" />

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Internal Notes (optional)
          </label>
          <textarea
            rows={3}
            placeholder="Lane strengths, performance notes, special considerations…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => navigate('/carriers')}
            className="px-5 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors"
          >
            <Users className="h-4 w-4" />
            Add Carrier
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
