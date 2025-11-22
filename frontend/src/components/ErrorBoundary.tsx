import { Component, ReactNode } from 'react';
import { Warning } from '@phosphor-icons/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-gradient-to-br from-red-900/20 to-gray-900/90 backdrop-blur-xl rounded-3xl border-2 border-red-500/50 p-12 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mb-6">
                <Warning size={48} weight="fill" className="text-red-400" />
              </div>
              <h1 className="text-4xl font-black text-white mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Don't worry, your data is safe. Try refreshing the page or contact support if the problem persists.
              </p>

              {this.state.error && (
                <details className="text-left mb-8 bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                  <summary className="cursor-pointer text-gray-400 font-mono text-sm mb-2">
                    Error Details
                  </summary>
                  <pre className="text-xs text-red-300 overflow-auto">
                    {this.state.error.toString()}
                    {'\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-cyan-500/30"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-2xl font-bold text-lg transition-all transform hover:scale-105"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
