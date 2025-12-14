import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }

        return this.props.children;
    }
}

const ErrorFallback = ({ error }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-orange-700 px-4">
            <div className="text-center max-w-2xl">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-50 animate-pulse" />
                        <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-full border-4 border-white/20">
                            <AlertTriangle size={80} className="text-yellow-300" />
                        </div>
                    </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Oops! Something Went Wrong
                </h2>
                <p className="text-lg text-white/90 mb-6">
                    An unexpected error occurred while rendering this page.
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-black/30 rounded-xl text-left">
                        <p className="text-sm text-red-300 font-mono break-all">
                            {error.toString()}
                        </p>
                    </div>
                )}

                <button
                    onClick={() => {
                        window.location.href = '/';
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-red-900 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg font-medium mx-auto"
                >
                    <Home size={20} />
                    <span>Go Home</span>
                </button>
            </div>
        </div>
    );
};

export default ErrorBoundary;
