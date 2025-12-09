import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { getEventColor } from '../../../utils/colors';

const CalendarEvent = ({ event, index, style, className = "" }) => {
    const elRef = useRef(null);

    useLayoutEffect(() => {
        if (!elRef.current) return;

        const el = elRef.current;
        const finalWidth = style.width; // e.g. "400px"

        // Intersection Observer to trigger animation when in viewport
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Animate!
                        gsap.fromTo(el,
                            {
                                width: "56px", // Circle size (h-14)
                                borderRadius: "50px", // Fully rounded start
                                opacity: 0
                            },
                            {
                                width: finalWidth,
                                borderRadius: "50px", // Fully rounded end (pill shape)
                                opacity: 1,
                                duration: 1.5, // Slower growth
                                delay: Math.random() * 0.3, // Random start for "organic" feel
                                ease: "power3.out", // Smooth deceleration
                                overwrite: true
                            }
                        );
                        observer.unobserve(el);
                    }
                });
            },
            {
                root: null, // viewport
                threshold: 0.1, // Trigger when 10% visible
                rootMargin: "0px 100px 0px 100px" // Pre-load slightly before entering screen
            }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [style.width]); // Re-run if intrinsic width changes

    return (
        <div
            ref={elRef}
            className={`absolute h-14 rounded-full shadow-lg flex items-center px-4 gap-3 cursor-pointer hover:scale-105 transition-transform border border-white/20 overflow-hidden ${getEventColor(index)} ${className}`}
            style={style}
        >
            <span className="text-2xl min-w-[24px] text-center">{event.icon}</span>
            <div className="flex flex-col leading-tight whitespace-nowrap overflow-hidden">
                <span className="font-bold text-white">{event.title}</span>
                <span className="text-xs text-white/80">{event.start_date}</span>
            </div>
        </div>
    );
};

export default CalendarEvent;
