import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const YEAR_WIDTH = 1200; // 100px per month

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [settings, setSettings] = useState({ calendar_start_year: 2020, calendar_end_year: 2030 });
    const [currentYear, setCurrentYear] = useState(2020);

    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const knobRef = useRef(null);
    const scrollbarRef = useRef(null);
    const proxyRef = useRef(document.createElement("div"));


    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsRes, settingsRes] = await Promise.all([
                    axios.get('http://localhost:8000/calendar/'),
                    axios.get('http://localhost:8000/settings/')
                ]);

                setEvents(eventsRes.data);
                if (settingsRes.data) {
                    setSettings(settingsRes.data);
                    setCurrentYear(settingsRes.data.calendar_start_year);
                }
            } catch (error) {
                console.error("Failed to fetch calendar data", error);
            }
        };
        fetchData();
    }, []);

    const { startYear, endYear, totalYears, totalWidth } = useMemo(() => {
        const start = settings.calendar_start_year;
        const end = settings.calendar_end_year;
        const total = end - start + 1;
        return {
            startYear: start,
            endYear: end,
            totalYears: total,
            totalWidth: total * YEAR_WIDTH
        };
    }, [settings]);

    // GSAP Animation & Interaction
    useEffect(() => {
        if (!trackRef.current || !knobRef.current || !scrollbarRef.current) return;

        const track = trackRef.current;
        const knob = knobRef.current;
        const scrollbar = scrollbarRef.current;
        const proxy = proxyRef.current;

        const ctx = gsap.context(() => {
            // Calculate bounds
            const maxScroll = totalWidth - window.innerWidth;
            const scrollbarWidth = scrollbar.offsetWidth;
            const knobWidth = knob.offsetWidth;
            const maxKnobX = scrollbarWidth - knobWidth;

            // Update function
            const update = () => {
                const p = gsap.getProperty(proxy, "x") / maxKnobX;
                const trackX = -p * maxScroll;

                gsap.set(track, { x: trackX });

                // Update current year based on scroll position
                const progress = p * totalYears;
                const yearIndex = Math.floor(progress);
                const newYear = startYear + yearIndex;
                if (newYear !== currentYear && newYear <= endYear) {
                    setCurrentYear(newYear);
                }
            };

            // Draggable for Knob
            Draggable.create(proxy, {
                type: "x",
                trigger: knob,
                bounds: { minX: 0, maxX: maxKnobX },
                inertia: true,
                edgeResistance: 0.65,
                dragResistance: 0.2, // Add some resistance for smoother feel
                onDrag: function () {
                    gsap.set(knob, { x: this.x });
                    update();
                },
                onThrowUpdate: function () {
                    gsap.set(knob, { x: this.x });
                    update();
                }
            });

            // Mouse Wheel
            const handleWheel = (e) => {
                e.preventDefault();
                const currentX = gsap.getProperty(proxy, "x");
                // Reduced sensitivity from 0.5 to 0.2 for finer control
                let newX = currentX + e.deltaY * 0.2;

                // Clamp
                newX = Math.max(0, Math.min(newX, maxKnobX));

                gsap.to(proxy, {
                    x: newX,
                    duration: 0.8, // Increased duration for smoother glide
                    ease: "power3.out", // Smoother easing
                    overwrite: true, // Ensure new scrolls override old ones smoothly
                    onUpdate: () => {
                        gsap.set(knob, { x: newX }); // Sync knob visual
                        update(); // Sync track
                    }
                });
            };

            window.addEventListener('wheel', handleWheel, { passive: false });

            return () => {
                window.removeEventListener('wheel', handleWheel);
            };

        }, containerRef);

        return () => ctx.revert();
    }, [totalWidth, totalYears, startYear, endYear, currentYear]);

    // Helper for colorful chips
    const getEventColor = (index) => {
        const colors = [
            'bg-red-500', 'bg-orange-500', 'bg-amber-500',
            'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
            'bg-cyan-500', 'bg-sky-500', 'bg-blue-500',
            'bg-indigo-500', 'bg-violet-500', 'bg-purple-500',
            'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
        ];
        return colors[index % colors.length];
    };

    // Calculate event position
    const getEventStyle = (event, index) => {
        const startDate = new Date(event.start_date);
        const startYearVal = startDate.getFullYear();
        const startMonth = startDate.getMonth();

        // Calculate offset from start of timeline
        const yearsFromStart = startYearVal - startYear;
        const monthsFromStart = yearsFromStart * 12 + startMonth;

        const left = (monthsFromStart / (totalYears * 12)) * totalWidth;

        // Duration width (min 1 month)
        const endDate = event.end_date ? new Date(event.end_date) : startDate;
        const durationMonths = ((endDate.getFullYear() - startYearVal) * 12) + (endDate.getMonth() - startMonth) + 1;
        const width = (durationMonths / (totalYears * 12)) * totalWidth;

        // Stagger vertical position to avoid overlap (simple modulo for now)
        const top = 150 + (index % 5) * 70;

        return {
            left: `${left}px`,
            width: `${Math.max(width, 80)}px`, // Min width for visibility
            top: `${top}px`
        };
    };

    return (
        <div ref={containerRef} className="h-screen w-full bg-surface text-primary overflow-hidden relative font-sans transition-colors duration-300">

            {/* Year Counter (Fixed Background) */}
            <div className="absolute top-24 left-10 z-0 pointer-events-none">
                <h1 className="text-[15vw] font-bold text-primary/30 leading-none tracking-tighter transition-all duration-300">
                    {currentYear}
                </h1>
            </div>

            {/* Timeline Track */}
            <div ref={trackRef} className="absolute top-0 left-0 h-full flex items-center" style={{ width: totalWidth }}>
                {/* Grid & Markers */}
                {Array.from({ length: totalYears }).map((_, yearIdx) => {
                    const year = startYear + yearIdx;
                    return (
                        <div key={year} className="h-full border-l border-secondary/30 relative transition-colors duration-300" style={{ width: YEAR_WIDTH }}>
                            <div className="absolute top-4 left-4 text-2xl font-bold text-primary">{year}</div>
                            {/* Months */}
                            <div className="absolute bottom-32 left-0 w-full flex justify-between px-4  text-secondary text-sm uppercase tracking-widest">
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                    <span key={m}>{m}</span>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Events */}
                {events.map((event, i) => (
                    <div
                        key={event.id}
                        className={`absolute h-14 rounded-xl shadow-lg flex items-center px-4 gap-3 cursor-pointer hover:scale-105 transition-transform border border-white/20 ${getEventColor(i)}`}
                        style={getEventStyle(event, i)}
                    >
                        <span className="text-2xl">{event.icon}</span>
                        <div className="flex flex-col leading-tight">
                            <span className="font-bold text-white whitespace-nowrap">{event.title}</span>
                            <span className="text-xs text-white/80">{event.start_date}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Scrollbar & Knob */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-16 z-20 flex items-center gap-4">
                <span className="text-secondary font-mono">{startYear}</span>

                <div ref={scrollbarRef} className="flex-1 h-2 bg-accent rounded-full relative transition-colors duration-300">
                    <div
                        ref={knobRef}
                        className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-lg shadow-[0_0_20px_rgba(var(--accent),0.5)] cursor-grab active:cursor-grabbing flex items-center justify-center border-2 border-surface transition-colors duration-300"
                    >
                        <div className="w-4 h-4 bg-accent rounded-full" />
                    </div>
                </div>

                <span className="text-secondary font-mono">{endYear}</span>
            </div>
        </div>
    );
};

export default Calendar;
