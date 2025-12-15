import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Calendar,
    FileText,
    LayoutGrid,
    Settings,
    Menu,
    X,
    Home,
    LogOut,
} from 'lucide-react';

import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/core/context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();

    const isShowcasing = location.pathname === '/showcasing';

    const links = [
        { name: 'Home', path: '/', icon: <Home size={20} /> },
        { name: 'Calendar', path: '/calendar', icon: <Calendar size={20} /> },
        { name: 'Resume', path: '/resume', icon: <FileText size={20} /> },
        { name: 'Showcasing', path: '/showcasing', icon: <LayoutGrid size={20} /> },
        { name: 'Admin', path: '/admin', icon: <Settings size={20} /> },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    /** Forced color tokens */
    const baseText = isShowcasing ? 'text-white' : 'text-secondary';
    const hoverText = isShowcasing ? 'hover:text-white' : 'hover:text-primary';
    const activeText = isShowcasing ? 'text-white' : 'text-secondary';

    return (
        <nav className="no-print fixed top-0 left-0 w-full z-50 px-4 py-3 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Main Bar */}
                <div className="bg-glass backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg">

                    {/* Title */}
                    <Link
                        to="/"
                        className={`text-xl inline-block overflow-hidden text-ellipsis font-bold transition-opacity hover:opacity-80 ${
                            isShowcasing ? 'text-white' : 'text-primary/80'
                        }`}
                    >
                        Welcome to my space
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6">
                        {links.map(link => {
                            const isActive = location.pathname === link.path;

                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 group
                                        ${isActive
                                            ? 'bg-white/20'
                                            : 'hover:bg-white/10'
                                        }
                                        ${isActive ? activeText : `${baseText} ${hoverText}`}
                                    `}
                                >
                                    <span className="group-hover:scale-110 transition-transform duration-300">
                                        {link.icon}
                                    </span>
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {isAuthenticated() && (
                            <button
                                onClick={logout}
                                className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 group
                                    ${isShowcasing ? 'text-white hover:bg-white/20' : 'text-accent hover:bg-accent/20'}
                                `}
                                title="Logout"
                            >
                                <LogOut
                                    size={20}
                                    className="group-hover:scale-110 transition-transform duration-300"
                                />
                                <span className="font-medium">Logout</span>
                            </button>
                        )}

                        {/* Mobile Toggle */}
                        <button
                            onClick={toggleMenu}
                            className={`lg:hidden p-2 rounded-lg transition-colors
                                ${isShowcasing ? 'text-white hover:bg-white/20' : 'text-secondary hover:bg-white/10'}
                            `}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="absolute top-full left-0 w-full px-4 mt-2 lg:hidden">
                        <div className="bg-glass backdrop-blur-xl border border-secondary rounded-2xl p-4 shadow-2xl flex flex-col gap-2">

                            {links.map(link => {
                                const isActive = location.pathname === link.path;

                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                                            ${isActive
                                                ? 'bg-white/20 text-white'
                                                : isShowcasing
                                                    ? 'text-white hover:bg-white/10'
                                                    : 'text-secondary hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        {link.icon}
                                        <span className="font-medium">{link.name}</span>
                                    </Link>
                                );
                            })}

                            {isAuthenticated() && (
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                                        ${isShowcasing ? 'text-white hover:bg-white/10' : 'text-secondary'}
                                    `}
                                >
                                    <LogOut size={20} />
                                    <span className="font-medium">Logout</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
