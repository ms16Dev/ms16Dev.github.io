import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/context/AuthContext';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(credentials);
        setLoading(false);

        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.error);
        }
    };

    const inputClass = "w-full bg-surface border border-accent rounded-xl p-3 pl-10 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all";
    const labelClass = "block text-sm font-medium mb-2 text-accent";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent px-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 rounded-2xl shadow-2xl p-8 border border-accent/20">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
                            <LogIn size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">Admin Login</h1>
                        <p className="text-muted">Sign in to access the dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className={labelClass}>Username</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-muted">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Password</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-muted">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    className={inputClass}
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-secondary dark:bg-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-accent/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
