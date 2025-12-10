import { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Search, SwatchBook, Code2 } from 'lucide-react';


const HomeCalendarCard = () => {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Timeline Animation (Bottom Line)
            const timeline = gsap.timeline({ repeat: -1, yoyo: true });
            timeline.to(".timeline-dot", {
                x: 100,
                duration: 2,
                stagger: 0.2,
                ease: "power1.inOut"
            });

            // Calendar Flip Animation (3D Pages)
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
            tl.to(".cal-page-1", {
                rotateX: -180,
                transformOrigin: "bottom center",
                duration: 0.8,
                ease: "power2.inOut",
                zIndex: 20
            })
                .set(".cal-page-1", { zIndex: 1, rotateX: 0, opacity: 0 }) // Reset
                .to(".cal-page-2", {
                    rotateX: -180,
                    transformOrigin: "bottom center",
                    duration: 0.8,
                    ease: "power2.inOut"
                }, "-=0.2")
                .to(".cal-page-1", { opacity: 1, duration: 0.1 }); // Restore for loop

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <Link
            to="/calendar"
            ref={containerRef}
            className="group relative w-full h-full bg-glass backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center perspective-1000"
        >
            {/* Title (Secondary/Floating) */}
            <h2 className="absolute top-4 text-sm font-bold text-secondary/80 uppercase tracking-widest z-10">Calendar</h2>

            {/* Calendar Visual */}
            <div className="relative w-26 h-30 mb-6 perspective-1000">
                {/* Back Page (Static) */}
                <div className="absolute inset-0 bg-surface border border-white/20 rounded-lg shadow-lg flex flex-col p-2">
                    <div className="h-4 bg-primary/20 w-full rounded-sm mb-2" />
                    <div className="flex-1 grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-secondary/20 rounded-sm" />
                        ))}
                    </div>
                </div>

                {/* Front Page 2 (Flipping) */}
                <div className="cal-page-2 absolute inset-0 bg-surface border border-white/20 rounded-lg shadow-lg flex flex-col p-2 backface-hidden origin-bottom">
                    <div className="h-4 bg-accent/20 w-full rounded-sm mb-2" />
                    <div className="flex-1 grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-accent/10 rounded-sm" />
                        ))}
                    </div>
                </div>

                {/* Front Page 1 (Flipping First) */}
                <div className="cal-page-1 absolute inset-0 bg-surface border border-white/20 rounded-lg shadow-lg flex flex-col p-2 backface-hidden origin-bottom z-10">
                    <div className="h-4 bg-primary/40 w-full rounded-sm mb-2" />
                    <div className="flex-1 grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-primary/20 rounded-sm" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline Visual */}
            <div className="w-3/4 h-1 bg-white/10 rounded-full overflow-hidden flex items-center px-0">
                <SwatchBook size={18} className="timeline-dot text-accent rounded-full absolute left-8" />
                <Search size={18} className="timeline-dot text-secondary rounded-full absolute left-14 opacity-60" />
                <Code2 size={18} className="timeline-dot text-white rounded-full absolute left-8 opacity-40" />
            </div>

        </Link>
    );
};

export default HomeCalendarCard;
