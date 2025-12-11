import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useCalendarInteraction = ({
    trackRef,
    totalWidth,
    totalYears,
    startYear,
    endYear,
    initialYear
}) => {
    const [currentYear, setCurrentYear] = useState(initialYear || startYear);
    const [progress, setProgress] = useState(0); // 0 to 1
    const currentYearRef = useRef(initialYear || startYear);
    const progressRef = useRef(0);

    // Sync currentYear with startYear when it changes (data load)
    useEffect(() => {
        if (!initialYear) {
            setCurrentYear(startYear);
            currentYearRef.current = startYear;
        }
    }, [startYear, initialYear]);

    // Unified update function
    const updatePosition = (p) => {
        // Clamp 0 to 1
        p = Math.max(0, Math.min(1, p));

        setProgress(p);
        progressRef.current = p;

        // Update timeline position
        if (trackRef.current) {
            const maxScroll = totalWidth - window.innerWidth;
            gsap.to(trackRef.current, {
                x: -p * maxScroll,
                duration: 0.5,
                ease: "power2.out",
                overwrite: true
            });
        }

        // Calculate and update current year
        const yearProgress = p * totalYears;
        const yearIndex = Math.floor(yearProgress);
        const newYear = Math.min(startYear + yearIndex, endYear);

        if (newYear !== currentYearRef.current) {
            setCurrentYear(newYear);
            currentYearRef.current = newYear;
        }
    };

    // Handle standard scroll input (slider)
    const handleScroll = (e) => {
        const val = parseFloat(e.target.value); // 0 to 100
        updatePosition(val / 100);
    };

    // Handle Wheel Input
    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();
            // Sensitivity factor
            const delta = e.deltaY * 0.0005; // Adjust this for speed
            const newProgress = progressRef.current + delta;
            updatePosition(newProgress);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [totalWidth, totalYears, startYear, endYear]); // Dependencies for calculation

    // Update Tween on Resize (Responsive)
    useEffect(() => {
        const handleResize = () => {
            if (trackRef.current) {
                const p = progressRef.current;
                const maxScroll = totalWidth - window.innerWidth;
                gsap.set(trackRef.current, { x: -p * maxScroll });
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [totalWidth, trackRef]);

    return { currentYear, handleScroll, progress };
};
