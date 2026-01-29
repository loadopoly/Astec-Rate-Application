/**
 * IPS Freight Platform - Root Application Component
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout'

// Pages (to be implemented)
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
        {/* Public routes */}
        {/* <Route path="/login" element={<LoginPage />} /> */}

        {/* Protected routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="quotes/*" element={<QuotesPage />} />
          <Route path="lanes/*" element={<LanesPage />} />
          <Route path="carriers/*" element={<CarriersPage />} />
          <Route path="analytics/*" element={<AnalyticsPage />} />
          <Route path="settings/*" element={<SettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* Global toast notifications */}
      <Toaster />
    </>
  )
}

export default App
