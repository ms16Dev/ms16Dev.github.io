import { useToast } from '../context/ToastContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastDemo = () => {
    const { addToast } = useToast();

    const demoToasts = [
        {
            type: 'success',
            icon: CheckCircle,
            label: 'Success Toast',
            message: 'Operation completed successfully!',
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            type: 'error',
            icon: AlertCircle,
            label: 'Error Toast',
            message: 'Something went wrong. Please try again.',
            color: 'bg-red-500 hover:bg-red-600'
        },
        {
            type: 'warning',
            icon: AlertTriangle,
            label: 'Warning Toast',
            message: 'Please review your changes before saving.',
            color: 'bg-yellow-500 hover:bg-yellow-600'
        },
        {
            type: 'info',
            icon: Info,
            label: 'Info Toast',
            message: 'Here is some helpful information for you.',
            color: 'bg-blue-500 hover:bg-blue-600'
        }
    ];

    return (
        <div className="p-8 bg-surface dark:bg-surface rounded-xl shadow-lg max-w-2xl mx-auto my-8">
            <h2 className="text-2xl font-bold text-primary dark:text-primary mb-4">
                Toast Notifications Demo
            </h2>
            <p className="text-muted mb-6">
                Click any button below to see different toast notification styles
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {demoToasts.map((toast) => {
                    const Icon = toast.icon;
                    return (
                        <button
                            key={toast.type}
                            onClick={() => addToast(toast.message, toast.type)}
                            className={`
                                flex items-center gap-3 px-6 py-4 text-white
                                ${toast.color}
                                transition-all hover:scale-105 active:scale-95
                                shadow-lg
                            `}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{toast.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 p-4 bg-surface-2 dark:bg-surface-2 rounded-lg">
                <h3 className="font-semibold text-primary dark:text-primary mb-2">Toast Features:</h3>
                <ul className="text-sm text-muted space-y-1 list-disc list-inside">
                    <li>Left thick border in <strong>secondary</strong> color</li>
                    <li>Background uses <strong>surface</strong> color from theme</li>
                    <li>Text in <strong>primary</strong> color</li>
                    <li>Icons colored based on toast type (success/error/warning/info)</li>
                    <li>Auto-dismiss after 3 seconds</li>
                    <li>Smooth slide-in animation</li>
                    <li>Manual close button</li>
                </ul>
            </div>
        </div>
    );
};

export default ToastDemo;
