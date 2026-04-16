import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { DashboardPage } from './features/dashboard'
import { QuotesPage, QuoteDetailPage } from './features/quotes'
import { LanesPage, LaneDetailPage } from './features/lanes'
import { CarriersPage, CarrierDetailPage } from './features/carriers'
import { AnalyticsPage } from './features/analytics'
import { SettingsPage } from './features/settings'
import { NewQuotePage } from './features/quotes/NewQuotePage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="quotes" element={<QuotesPage />} />
          <Route path="quotes/new" element={<NewQuotePage />} />
          <Route path="quotes/:id" element={<QuoteDetailPage />} />
          <Route path="lanes" element={<LanesPage />} />
          <Route path="lanes/:dest" element={<LaneDetailPage />} />
          <Route path="carriers" element={<CarriersPage />} />
          <Route path="carriers/:mc" element={<CarrierDetailPage />} />
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
