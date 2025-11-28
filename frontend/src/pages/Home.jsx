import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
    const containerRef = useRef(null);
    const aboutRef = useRef(null);
    const resumeRef = useRef(null);
    const calendarRef = useRef(null);
    const vantaRef = useRef(null);

    const { theme } = useTheme();
    const bgRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from([resumeRef.current, aboutRef.current, calendarRef.current], {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                clearProps: "all" // Ensure no residual transforms affect layout
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Initialize Vanta NET effect with Theme Support
    useEffect(() => {
        if (bgRef.current) {
            // Destroy previous instance if it exists
            if (vantaRef.current) {
                vantaRef.current.destroy();
            }

            const isDark = theme === 'dark';

            vantaRef.current = NET({
                el: bgRef.current,
                THREE,
                color: isDark ? 0x3b82f6 : 0x3b82f6, // Blue points in both for contrast, or adjust
                backgroundColor: isDark ? 0x0f172a : 0xefefef, // Slate-900 vs Light Gray
                points: 20.00,
                maxDistance: 20.00,
                spacing: 18.00,
                showDots: true
            });
        }

        return () => {
            if (vantaRef.current) {
                vantaRef.current.destroy();
                vantaRef.current = null;
            }
        };
    }, [theme]); // Re-run when theme changes

    return (
        <div ref={containerRef} className="min-h-screen w-full flex flex-col items-center justify-center relative p-4 md:p-8 overflow-y-auto">
            {/* Vanta Background */}
            <div ref={bgRef} className="fixed inset-0 -z-10" />

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full max-w-7xl h-auto md:h-[70vh] my-8 md:my-0">

                {/* Resume Card (Left) */}
                <Link to="/resume" ref={resumeRef} className="group relative w-full md:w-1/5 h-48 md:h-3/5 bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 order-2 md:order-1">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 group-hover:text-accent transition-colors">Resume</h2>
                    </div>
                </Link>

                {/* About Card (Center - Larger with Glass Effect) */}
                <div ref={aboutRef} className="relative w-full md:w-3/5 h-[550px] md:h-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-lg rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 order-1 md:order-2">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-center">About Me</h1>
                    <p className="text-base md:text-xl text-slate-700 dark:text-slate-300 text-center max-w-lg leading-relaxed">
                        Passionate Fullstack Developer crafting digital experiences with code and creativity.
                    </p>
                    <div className="mt-8">
                        {/* Content loaded from API later */}
                    </div>

                    {/* Link to Showcasing at bottom of About/Home */}
                    <Link to="/showcasing" className="absolute bottom-8 text-sm uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-semibold">
                        View Showcasing →
                    </Link>
                </div>

                {/* Calendar Card (Right) */}
                <Link to="/calendar" ref={calendarRef} className="group relative w-full md:w-1/5 h-48 md:h-3/5 bg-white/10 dark:bg-slate-800/30 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 order-3 md:order-3">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 group-hover:text-accent transition-colors">Calendar</h2>
                    </div>
                </Link>

            </div>
        </div>
    );
};

export default Home;
