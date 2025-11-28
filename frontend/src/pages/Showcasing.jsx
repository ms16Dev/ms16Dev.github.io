import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import axios from 'axios';
import { ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import FabricBackground from '../components/FabricBackground';

const Showcasing = () => {
    const [projects, setProjects] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const titleRef = useRef(null);
    const detailsRef = useRef(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:8000/projects/');
                setProjects(response.data);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            }
        };
        fetchProjects();
    }, []);

    // Animation when index changes
    useEffect(() => {
        if (projects.length === 0) return;

        const ctx = gsap.context(() => {
            // Animate Content (Slide Up)
            const tl = gsap.timeline();

            tl.fromTo(titleRef.current,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
            )
                .fromTo(detailsRef.current,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                    "-=0.6"
                );

        }, containerRef);

        return () => ctx.revert();
    }, [currentIndex, projects]);

    // Mouse wheel scroll navigation
    useEffect(() => {
        if (projects.length === 0) return;

        let scrollTimeout;
        const handleWheel = (event) => {
            // Prevent default scroll behavior
            event.preventDefault();

            // Debounce scroll events
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (isAnimating) return;

                // Detect scroll direction
                if (event.deltaY > 0) {
                    // Scroll down - next project
                    handleNext();
                } else if (event.deltaY < 0) {
                    // Scroll up - previous project
                    handlePrev();
                }
            }, 50); // Small delay to prevent too rapid scrolling
        };

        // Add wheel event listener
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
            clearTimeout(scrollTimeout);
        };
    }, [projects, isAnimating]);

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        // Exit animation
        gsap.to([titleRef.current, detailsRef.current], {
            y: -50,
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                setCurrentIndex((prev) => (prev + 1) % projects.length);
                setIsAnimating(false);
            }
        });
    };

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        // Exit animation
        gsap.to([titleRef.current, detailsRef.current], {
            y: 50,
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
                setIsAnimating(false);
            }
        });
    };

    if (projects.length === 0) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

    const currentProject = projects[currentIndex];

    return (
        <div ref={containerRef} className="h-screen w-full relative overflow-hidden bg-black">
            {/* Dynamic Background */}
            <FabricBackground key={currentIndex} imageUrl={currentProject.background_image_url} />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" /> {/* Overlay */}

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 md:px-20">

                {/* Project Content */}
                <div ref={contentRef} className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Text Section */}
                    <div className="space-y-8 w-full max-w-full overflow-hidden">
                        <div ref={titleRef} className="w-full">
                            <div className="inline-block px-3 py-1 md:px-4 md:py-1 border border-accent/50 rounded-full text-accent text-xs md:text-sm font-mono mb-3 md:mb-4 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                {currentProject.start_date} — {currentProject.end_date || 'Present'}
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight break-words overflow-wrap-anywhere">
                                {currentProject.title}
                            </h1>
                        </div>

                        <div ref={detailsRef} className="space-y-6 w-full">
                            <p className="text-base md:text-lg text-slate-200 leading-relaxed w-full max-w-xl break-words">
                                {currentProject.description}
                            </p>

                            <div className="flex flex-wrap gap-2 w-full">
                                {currentProject.tags.split(' ').filter(tag => tag.trim()).map((tag, i) => {
                                    // Array of vibrant color combinations
                                    const colors = [
                                        'bg-blue-500/20 border-blue-400/50 text-blue-200',
                                        'bg-purple-500/20 border-purple-400/50 text-purple-200',
                                        'bg-pink-500/20 border-pink-400/50 text-pink-200',
                                        'bg-green-500/20 border-green-400/50 text-green-200',
                                        'bg-yellow-500/20 border-yellow-400/50 text-yellow-200',
                                        'bg-orange-500/20 border-orange-400/50 text-orange-200',
                                        'bg-teal-500/20 border-teal-400/50 text-teal-200',
                                        'bg-cyan-500/20 border-cyan-400/50 text-cyan-200',
                                        'bg-indigo-500/20 border-indigo-400/50 text-indigo-200',
                                        'bg-rose-500/20 border-rose-400/50 text-rose-200',
                                    ];
                                    const colorClass = colors[i % colors.length];

                                    return (
                                        <span key={i} className={`px-3 py-1.5 md:px-4 md:py-2 backdrop-blur-sm rounded-lg text-xs md:text-sm border ${colorClass}`}>
                                            {tag.trim()}
                                        </span>
                                    );
                                })}
                            </div>

                            <button className="group flex items-center gap-2 text-white border-b border-white pb-1 hover:text-accent hover:border-accent transition-colors mt-8">
                                View Case Study <ExternalLink size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Visual/Decoration Section (Optional - could be a preview image or 3D element) */}
                    <div className="hidden md:flex justify-center items-center">
                        {/* Placeholder for extra visual or just empty to let background shine */}
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
                    <button
                        onClick={handlePrev}
                        className="p-4 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all hover:scale-110 group"
                    >
                        <ChevronUp className="text-white group-hover:text-accent" size={24} />
                    </button>
                    <div className="flex flex-col items-center gap-2 py-4">
                        {projects.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'h-8 bg-accent' : 'h-1.5 bg-white/30'}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleNext}
                        className="p-4 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all hover:scale-110 group"
                    >
                        <ChevronDown className="text-white group-hover:text-accent" size={24} />
                    </button>
                </div>

                {/* Progress/Counter */}
                <div className="absolute bottom-12 left-12 text-white font-mono text-xl opacity-50">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                </div>
            </div >
        </div >
    );
};

export default Showcasing;
