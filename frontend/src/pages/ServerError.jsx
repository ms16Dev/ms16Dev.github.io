import { useNavigate } from 'react-router-dom';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

const ServerError = () => {
    const navigate = useNavigate();

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-orange-700 px-4">
            <div className="text-center max-w-2xl">
                {/* Animated Error Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-50 animate-pulse" />
                        <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-full border-4 border-white/20">
                            <AlertTriangle size={80} className="text-yellow-300 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h1 className="text-6xl md:text-8xl font-bold text-white/20 mb-4">
                        500
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Server Error
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-2">
                        Something went wrong on our end.
                    </p>
                    <p className="text-md text-white/70">
                        We're working to fix the issue. Please try again in a moment.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all hover:scale-105 active:scale-95 text-white backdrop-blur-md min-w-[180px]"
                    >
                        <RefreshCw size={20} />
                        <span className="font-medium">Refresh Page</span>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-red-900 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg min-w-[180px] font-medium"
                    >
                        <Home size={20} />
                        <span>Go Home</span>
                    </button>
                </div>

                {/* Status Info */}
                <div className="mt-12 text-white/60 text-sm">
                    <p>Error Code: 500 Internal Server Error</p>
                    <p className="mt-1">If this persists, please contact support.</p>
                </div>
            </div>
        </div>
    );
};

export default ServerError;
