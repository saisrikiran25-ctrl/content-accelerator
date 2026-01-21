import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Configuration Error
              </h1>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">
                The application encountered a configuration error and couldn't start properly.
              </p>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-mono text-sm text-red-800 break-words">
                  {this.state.error?.message || 'Unknown error'}
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-semibold text-blue-900 mb-2">
                  💡 Common Solutions:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                  <li>Ensure environment variables are configured in GitHub repository settings</li>
                  <li>Check that VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set</li>
                  <li>Verify the GitHub Actions workflow has environment variables in the build step</li>
                  <li>If running locally, ensure you have a .env file with the required variables</li>
                </ul>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reload Page
                </button>
                <a
                  href="https://github.com/saisrikiran25-ctrl/content-accelerator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  View Repository
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
