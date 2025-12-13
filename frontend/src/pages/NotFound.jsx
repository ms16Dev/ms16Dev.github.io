import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent px-4">
            <div className="text-center max-w-2xl">
                {/* Animated 404 */}
                <div className="mb-8">
                    <h1 className="text-[150px] md:text-[200px] font-bold text-white/20 leading-none animate-pulse">
                        404
                    </h1>
                    <div className="relative -mt-16 md:-mt-24">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Page Not Found
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 mb-8">
                            Oops! The page you're looking for seems to have wandered off into the digital void.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all hover:scale-105 active:scale-95 text-white backdrop-blur-md min-w-[180px]"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Go Back</span>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-secondary rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg min-w-[180px] font-medium"
                    >
                        <Home size={20} />
                        <span>Go Home</span>
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="mt-16 flex justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-full bg-white/30 animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotFound;
