import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              !
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 text-sm mb-6">
              An unexpected error occurred while loading this section.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-[#20b2aa] hover:bg-[#1a9690] text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md text-sm cursor-pointer"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-xl transition-all border border-gray-300 text-sm cursor-pointer"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
