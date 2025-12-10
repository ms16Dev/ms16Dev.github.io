import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import HomeResumeCard from '../features/resume/components/HomeResumeCard';
import HomeCalendarCard from '../features/calendar/components/HomeCalendarCard';
import HomeAboutCard from '../components/ui/HomeAboutCard';

const Home = () => {
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const vantaRef = useRef(null);

    const { theme } = useTheme();


    const [aboutData, setAboutData] = useState(null);
    const [technologies, setTechnologies] = useState([]);

    // Fetch About data and Technologies
    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const aboutRes = await axios.get('http://localhost:8000/about/');
                setAboutData(aboutRes.data);

                const techRes = await axios.get('http://localhost:8000/about/technologies');
                setTechnologies(techRes.data);
            } catch (error) {
                console.error('Error fetching about data:', error);
            }
        };
        fetchAboutData();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".home-card-wrapper", {
                y: 100,
                duration: 3,
                stagger: 0,
                ease: "power3.out",
                clearProps: "all"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Initialize Vanta NET effect with Theme Support (Lazy Loaded)
    useEffect(() => {
        let effect = null;
        let vantaLib = null;
        let threeLib = null;

        const loadVanta = async () => {
            if (bgRef.current) {
                // Cleanup previous instance if re-running
                if (vantaRef.current) {
                    vantaRef.current.destroy();
                }

                try {
                    // Dynamic imports
                    vantaLib = (await import('vanta/dist/vanta.net.min')).default;
                    threeLib = await import('three');

                    const isDark = theme === 'dark';

                    effect = vantaLib({
                        el: bgRef.current,
                        THREE: threeLib,
                        color: isDark ? 0xe0ffff : 0xffb86a,
                        backgroundColor: isDark ? 0x0f172a : 0xfffbeb,
                        points: isDark ? 10.00 : 20.00,
                        maxDistance: isDark ? 28.00 : 20.00, // Slightly reduced maxDistance for perf
                        spacing: isDark ? 25.00 : 18.00,
                        showDots: true,
                        gyroControls: false, // Disable gyro for perf
                        minHeight: 200.00,
                        minWidth: 200.00,
                        scale: 1.00,
                        scaleMobile: 1.00
                    });

                    vantaRef.current = effect;

                    // Manual color update patch (kept from original)
                    setTimeout(() => {
                        if (!effect) return;
                        const lineHex = isDark ? 0x002e63 : 0xffd6a7;
                        const scene = effect.scene || effect._scene;

                        scene?.traverse((obj) => {
                            if (obj.type === "LineSegments" && obj.material) {
                                if (obj.material.color) {
                                    obj.material.color.setHex(lineHex);
                                    obj.material.needsUpdate = true;
                                }
                                if (obj.material.uniforms) {
                                    Object.values(obj.material.uniforms).forEach((u) => {
                                        if (u?.value?.setHex) u.value.setHex(lineHex);
                                    });
                                }
                            }
                        });
                    }, 100);

                } catch (error) {
                    console.error("Failed to load Vanta background:", error);
                }
            }
        };

        const timer = setTimeout(() => {
            loadVanta();
        }, 50); // Delay slightly to prioritize critical UI paint

        return () => {
            clearTimeout(timer);
            if (vantaRef.current) {
                vantaRef.current.destroy();
                vantaRef.current = null;
            }
        };
    }, [theme]);



    return (
        <div ref={containerRef} className="min-h-screen w-full flex flex-col items-center justify-center relative p-4 md:p-8 overflow-y-auto">
            {/* Vanta Background */}
            <div
                ref={bgRef}
                className="fixed inset-0 transition-colors duration-500"
                style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fffbeb' }}
            />

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full max-w-7xl h-auto md:h-[70vh] my-24 md:my-0">

                {/* Resume Card (Left) */}
                <div className="home-card-wrapper w-full md:w-1/5 h-48 md:h-3/5 order-2 md:order-1">
                    <HomeResumeCard />
                </div>

                {/* About Card (Center) */}
                <div className="home-card-wrapper w-full md:w-3/5 h-[650px] md:h-full order-1 md:order-2 flex justify-center">
                    <HomeAboutCard aboutData={aboutData} technologies={technologies} />
                </div>

                {/* Calendar Card (Right) */}
                <div className="home-card-wrapper w-full md:w-1/5 h-48 md:h-3/5 order-3 md:order-3">
                    <HomeCalendarCard />
                </div>

            </div>
        </div>
    );
};

export default Home;
