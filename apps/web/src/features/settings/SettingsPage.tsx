import { Building2, Bell, RefreshCw, Shield, Mail, Clock } from 'lucide-react'

export function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-muted-foreground mt-1">Platform configuration for IPS Freight — Jerome Ave.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Site Profile */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-white">Site Profile</h2>
          </div>
          <SettingRow label="Facility Name"     value="Jerome Ave. — Chattanooga, TN" />
          <SettingRow label="Site Code"         value="CHT" />
          <SettingRow label="Address"           value="1600 Jerome Ave., Chattanooga, TN 37405" />
          <SettingRow label="Primary Contact"   value="Steve Pack — Logistics Manager" />
          <SettingRow label="Billing Entity"    value="Astec Industries / IPS Heavy Haul" />
        </div>

        {/* Rate Settings */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-white">Rate Settings</h2>
          </div>
          <SettingRow label="Budget Quote Method"   value="Historical Average (12mo)" />
          <SettingRow label="Market Rate Source"    value="DAT RateView" />
          <SettingRow label="Rate Update Frequency" value="Weekly (Mondays)" />
          <SettingRow label="Fuel Surcharge Basis"  value="DOE National Diesel — Weekly" />
          <SettingRow label="Default Equipment"     value="RGN / Lowboy" />
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-white">Notifications</h2>
          </div>
          <ToggleRow label="Email digest — Daily quote summary"    enabled={true}  icon={Mail} />
          <ToggleRow label="Alert when quote exceeds budget +10%"  enabled={true}  icon={Bell} />
          <ToggleRow label="Carrier on-time alert (below 90%)"     enabled={true}  icon={Clock} />
          <ToggleRow label="Weekly analytics report to management" enabled={false} icon={Mail} />
          <ToggleRow label="Rate spike alerts (lane avg +15%)"     enabled={true}  icon={Bell} />
        </div>

        {/* Security */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-white">Access &amp; Security</h2>
          </div>
          <SettingRow label="Authentication"    value="Email + Password" />
          <SettingRow label="Session Timeout"   value="8 hours" />
          <SettingRow label="Active Users"      value="4" />
          <SettingRow label="Last Login"        value="Today at 8:14 AM — Steve Pack" />
          <SettingRow label="API Version"       value="v0.1.0 — Render (Free Tier)" />
        </div>

      </div>
    </div>
  )
}

interface SettingRowProps {
  label: string
  value: string
}
function SettingRow({ label, value }: SettingRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground flex-shrink-0">{label}</span>
      <span className="text-sm text-white text-right">{value}</span>
    </div>
  )
}

interface ToggleRowProps {
  label: string
  enabled: boolean
  icon: React.ComponentType<{ className?: string }>
}
function ToggleRow({ label, enabled, icon: Icon }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm text-white">{label}</span>
      </div>
      <div className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-primary' : 'bg-secondary'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
    </div>
  )
}

