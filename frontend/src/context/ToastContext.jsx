import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

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
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border animate-slideIn
                            ${toast.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-100' : ''}
                            ${toast.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-100' : ''}
                            ${toast.type === 'info' ? 'bg-blue-500/20 border-blue-500/50 text-blue-100' : ''}
                        `}
                        role="alert"
                    >
                        {toast.type === 'success' && <CheckCircle size={20} className="text-green-400" />}
                        {toast.type === 'error' && <AlertCircle size={20} className="text-red-400" />}
                        {toast.type === 'info' && <Info size={20} className="text-blue-400" />}

                        <p className="font-medium text-sm">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-4 hover:bg-white/10 rounded-full p-1 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
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
