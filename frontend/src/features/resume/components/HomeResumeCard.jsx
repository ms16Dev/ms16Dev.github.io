import { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const HomeResumeCard = () => {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Animated Text Blocks (Skeleton)
            gsap.to(".skeleton-line", {
                scaleX: 1.1,
                opacity: 0.8,
                duration: 1.5,
                stagger: 0.1,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            gsap.to(".resume-paper", {
                y: -5,
                rotate: 2,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <Link
            to="/resume"
            ref={containerRef}
            className="group relative w-full h-full bg-glass backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center"
        >
            {/* Title (Secondary/Floating) */}
            <h2 className="absolute top-4 text-sm font-bold text-secondary/80 uppercase tracking-widest z-10">Resume</h2>

            {/* Resume Document Visual */}
            <div className="resume-paper relative w-24 h-32 bg-surface/90 border border-white/20 rounded-md shadow-2xl p-3 flex flex-col gap-2 transform rotate-2">

                {/* Header Skeleton */}
                <div className="flex gap-2 items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-secondary/30" />
                    <div className="flex flex-col gap-1">
                        <div className="skeleton-line w-12 h-2 bg-primary/40 rounded-full" />
                        <div className="skeleton-line w-8 h-1.5 bg-primary/20 rounded-full" />
                    </div>
                </div>

                {/* Body Text Skeletons */}
                <div className="space-y-1.5 opacity-80">
                    <div className="skeleton-line w-full h-1.5 bg-white/20 rounded-full origin-left" />
                    <div className="skeleton-line w-3/4 h-1.5 bg-white/20 rounded-full origin-left" />
                    <div className="skeleton-line w-5/6 h-1.5 bg-white/20 rounded-full origin-left" />
                </div>

                {/* Block 2 */}
                <div className="mt-2 space-y-1.5 opacity-80">
                    <div className="w-1/3 h-2 bg-accent/30 rounded-full mb-1" />
                    <div className="skeleton-line w-full h-1.5 bg-white/20 rounded-full origin-left" />
                    <div className="skeleton-line w-2/3 h-1.5 bg-white/20 rounded-full origin-left" />
                </div>

            </div>

            {/* Animated Decoration */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors" />

        </Link>
    );
};

export default HomeResumeCard;
