/**
 * Error Boundary
 *
 * Catches unhandled render errors so the whole app doesn't crash.
 * Shows a friendly "Something went wrong" UI with retry / go-home buttons.
 */

import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

/* -------------------------------------------------------
   Error Boundary — catches render errors so the whole app
   doesn't crash.  Shows a friendly retry / go-home UI.
   ------------------------------------------------------- */

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center space-y-5">
            <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">Something went wrong</h2>
              <p className="text-muted-foreground text-sm mt-2">
                An unexpected error occurred. Don&apos;t worry, your data is safe.
              </p>
            </div>

            {this.state.error && (
              <details className="text-left text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3">
                <summary className="cursor-pointer font-medium flex items-center gap-1.5">
                  Technical details
                </summary>
                <pre className="mt-2 whitespace-pre-wrap break-words">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-4 py-3 rounded-xl bg-secondary text-white text-sm hover:bg-secondary/80 transition-colors"
                aria-label="Go home"
              >
                <Home className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
