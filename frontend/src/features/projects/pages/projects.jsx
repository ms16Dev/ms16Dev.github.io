import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import FabricBackground from '../components/FabricBackground';
import { useProjectsData } from '../hooks/useProjectsData';
import ProjectShowcaseInfo from '../components/ProjectShowcaseInfo';
import ProjectShowcaseNavigation from '../components/ProjectShowcaseNavigation';

const Projects = () => {
    const { projects, loading, fetchProjectsData } = useProjectsData();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const titleRef = useRef(null);
    const detailsRef = useRef(null);

    /* --------------------------- Initial load --------------------------- */

    useEffect(() => {
        fetchProjectsData();
    }, [fetchProjectsData]);

    /* ---------------------- Animation on index change ------------------- */

    useEffect(() => {
        if (!projects || projects.length === 0) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            if (titleRef.current) {
                tl.fromTo(
                    titleRef.current,
                    { y: 100, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
                );
            }

            if (detailsRef.current) {
                tl.fromTo(
                    detailsRef.current,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
                    '-=0.6'
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, [currentIndex, projects]);

    /* --------------------- Mouse wheel navigation ----------------------- */

    useEffect(() => {
        if (!projects || projects.length === 0) return;

        let scrollTimeout;

        const handleWheel = (event) => {
            event.preventDefault();
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                if (isAnimating) return;

                if (event.deltaY > 0) handleNext();
                else if (event.deltaY < 0) handlePrev();
            }, 50);
        };

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
    }, [projects, isAnimating, currentIndex]);

    /* --------------------------- Navigation ----------------------------- */

    const handleNext = () => {
        if (isAnimating || !projects.length) return;

        setIsAnimating(true);
        const targets = [titleRef.current, detailsRef.current].filter(Boolean);

        gsap.to(targets, {
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
        if (isAnimating || !projects.length) return;

        setIsAnimating(true);
        const targets = [titleRef.current, detailsRef.current].filter(Boolean);

        gsap.to(targets, {
            y: 50,
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
                setIsAnimating(false);
            }
        });
    };

    /* ------------------------------ States ------------------------------ */

    if (loading && projects.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-black">
                Loading Projects...
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-black">
                No projects found.
            </div>
        );
    }

    const currentProject = projects[currentIndex];
    if (!currentProject) return null;

    /* ------------------------------- UI -------------------------------- */

    return (
        <div ref={containerRef} className="h-screen w-full relative overflow-hidden bg-black">
            {/* Dynamic Background */}
            <FabricBackground
                key={currentIndex}
                imageUrl={currentProject.background_image_url}
            />

            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-20">
                <div
                    ref={contentRef}
                    className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                    <ProjectShowcaseInfo
                        project={currentProject}
                        titleRef={titleRef}
                        detailsRef={detailsRef}
                    />

                    <div className="hidden md:flex justify-center items-center h-full" />
                </div>

                <ProjectShowcaseNavigation
                    projects={projects}
                    currentIndex={currentIndex}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    isAnimating={isAnimating}
                />

                <div className="absolute bottom-12 left-8 md:left-12 text-white/50 font-mono text-xl">
                    <span className="text-accent">
                        {String(currentIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="mx-2">/</span>
                    <span>{String(projects.length).padStart(2, '0')}</span>
                </div>
            </div>
        </div>
    );
};

export default Projects;
