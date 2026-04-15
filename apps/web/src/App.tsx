import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { DashboardPage } from './features/dashboard'
import { QuotesPage } from './features/quotes'
import { LanesPage } from './features/lanes'
import { CarriersPage } from './features/carriers'
import { AnalyticsPage } from './features/analytics'
import { SettingsPage } from './features/settings'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="quotes/*" element={<QuotesPage />} />
          <Route path="lanes/*" element={<LanesPage />} />
          <Route path="carriers/*" element={<CarriersPage />} />
          <Route path="analytics/*" element={<AnalyticsPage />} />
          <Route path="settings/*" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
