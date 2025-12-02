import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, FileText, LayoutGrid, Settings, Menu, X, Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { theme } = useTheme();

    const links = [
        { name: 'Home', path: '/', icon: <Home size={20} /> },
        { name: 'Calendar', path: '/calendar', icon: <Calendar size={20} /> },
        { name: 'Resume', path: '/resume', icon: <FileText size={20} /> },
        { name: 'Showcasing', path: '/showcasing', icon: <LayoutGrid size={20} /> },
        { name: 'Admin', path: '/admin', icon: <Settings size={20} /> },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-4 py-3 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-stone-500/40 dark:bg-blue-900/40 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg">

                    {/* Title */}
                    <Link to="/" className="text-xl font-bold text-white hover:opacity-80 transition-opacity">
                        Welcome to my space
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {links.map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 group ${location.pathname === link.path
                                    ? 'bg-white/20 text-white shadow-inner'
                                    : 'text-white hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <span className="group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {/* Mobile Toggle */}
                        <button onClick={toggleMenu} className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="absolute top-full left-0 w-full px-4 mt-2 md:hidden">
                        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl flex flex-col gap-2">
                            {links.map(link => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === link.path
                                        ? 'bg-blue-600/20 text-blue-400'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {link.icon}
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
