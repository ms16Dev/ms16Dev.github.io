import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

// Toast type configurations with icon colors
const toastConfig = {
    success: {
        icon: CheckCircle,
        iconColor: 'text-green-500 dark:text-green-400',
        bgGlow: 'shadow-green-500/10'
    },
    error: {
        icon: AlertCircle,
        iconColor: 'text-red-500 dark:text-red-400',
        bgGlow: 'shadow-red-500/10'
    },
    warning: {
        icon: AlertTriangle,
        iconColor: 'text-yellow-500 dark:text-yellow-400',
        bgGlow: 'shadow-yellow-500/10'
    },
    info: {
        icon: Info,
        iconColor: 'text-blue-500 dark:text-blue-400',
        bgGlow: 'shadow-blue-500/10'
    }
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now().toString() + Math.random().toString();
        setToasts(prev => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-50 flex flex-col gap-3 w-full max-w-md px-4 md:px-0">
                {toasts.map(toast => {
                    const config = toastConfig[toast.type] || toastConfig.info;
                    const Icon = config.icon;

                    return (
                        <div
                            key={toast.id}
                            className={`
                                flex items-center gap-3 px-4 py-3
                                bg-surface dark:bg-surface border-l-4 border-secondary
                                shadow-xl ${config.bgGlow}
                                backdrop-blur-sm
                                animate-slideIn
                                min-w-[300px]
                            `}
                            role="alert"
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <Icon size={22} className={config.iconColor} />
                            </div>

                            {/* Message */}
                            <p className="flex-1 font-medium text-sm text-primary dark:text-primary">
                                {toast.message}
                            </p>

                            {/* Close Button */}
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="flex-shrink-0 hover:bg-muted/10 dark:hover:bg-white/10 p-1.5 transition-colors text-muted hover:text-primary"
                                aria-label="Close notification"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
