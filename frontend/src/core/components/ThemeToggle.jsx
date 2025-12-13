import { useTheme } from '@/core/context/ThemeContext';
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
            className="p-3 rounded-full bg-stone-500/40 dark:bg-secondary/80 hover:bg-stone-500/80 dark:hover:bg-slate-500/80 backdrop-blur-sm border transition-colors shadow-lg z-50"
            aria-label="Toggle Theme"
        >
            <div ref={iconRef}>
                {theme === 'dark' ? <Moon size={16} className="text-white" /> : <Sun size={16} className="text-white" />}
            </div>
        </button>
    );
};

export default ThemeToggle;
