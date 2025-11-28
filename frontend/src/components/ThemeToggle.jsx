import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const iconRef = useRef(null);

    useEffect(() => {
        // Animate icon rotation on theme change
        gsap.fromTo(iconRef.current,
            { rotation: -90, scale: 0.5, opacity: 0 },
            { rotation: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }, [theme]);

    return (
        <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-secondary/80 backdrop-blur-sm border border-slate-700 hover:border-accent transition-colors shadow-lg z-50"
            aria-label="Toggle Theme"
        >
            <div ref={iconRef}>
                {theme === 'dark' ? <Moon size={24} className="text-accent" /> : <Sun size={24} className="text-orange-500" />}
            </div>
        </button>
    );
};

export default ThemeToggle;
