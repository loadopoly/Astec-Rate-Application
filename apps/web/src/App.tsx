import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { PageLoadingFallback } from './components/ui/PageLoadingFallback'

// Lazy-loaded route chunks — each page is fetched on demand so the initial
// bundle stays small and tab switches don't produce a blank page (the
// Suspense fallback shows a skeleton instead).
const DashboardPage = lazy(() =>
  import('./features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const QuotesPage = lazy(() =>
  import('./features/quotes/QuotesPage').then((m) => ({ default: m.QuotesPage })),
)
const LanesPage = lazy(() =>
  import('./features/lanes/LanesPage').then((m) => ({ default: m.LanesPage })),
)
const CarriersPage = lazy(() =>
  import('./features/carriers/CarriersPage').then((m) => ({ default: m.CarriersPage })),
)
const AnalyticsPage = lazy(() =>
  import('./features/analytics/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
)
const SettingsPage = lazy(() =>
  import('./features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="quotes/*"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <QuotesPage />
              </Suspense>
            }
          />
          <Route
            path="lanes/*"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <LanesPage />
              </Suspense>
            }
          />
          <Route
            path="carriers/*"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <CarriersPage />
              </Suspense>
            }
          />
          <Route
            path="analytics/*"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <AnalyticsPage />
              </Suspense>
            }
          />
          <Route
            path="settings/*"
            element={
              <Suspense fallback={<PageLoadingFallback />}>
                <SettingsPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
