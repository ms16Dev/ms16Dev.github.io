import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import { useTheme } from '../context/ThemeContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import axios from 'axios';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Home = () => {
    const containerRef = useRef(null);
    const aboutRef = useRef(null);
    const resumeRef = useRef(null);
    const calendarRef = useRef(null);
    const vantaRef = useRef(null);

    const { theme } = useTheme();
    const bgRef = useRef(null);

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
            gsap.from([resumeRef.current, aboutRef.current, calendarRef.current], {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                clearProps: "all"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Initialize Vanta NET effect with Theme Support
    useEffect(() => {
        if (bgRef.current) {
            if (vantaRef.current) {
                vantaRef.current.destroy();
            }

            const isDark = theme === 'dark';

            vantaRef.current = NET({
                el: bgRef.current,
                THREE,
                color: isDark ? 0xe0ffff : 0xffb86a,
                backgroundColor: isDark ? 0x0f172a : 0xfffbeb,
                points: isDark? 10.00 : 20,
                maxDistance: isDark ? 30.00: 20.00,
                spacing: isDark ? 25.00 : 18.00,
                showDots: true
            });

                            
                // ⬇️ Add this block here
                setTimeout(() => {
                    const effect = vantaRef.current;
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
                }, 150);
        }

        return () => {
            if (vantaRef.current) {
                vantaRef.current.destroy();
                vantaRef.current = null;
            }
        };
    }, [theme]);

    const getSocialIcon = (platform) => {
        const icons = {
            github: Github,
            linkedin: Linkedin,
            twitter: Twitter,
            email: Mail,
        };
        return icons[platform.toLowerCase()] || Mail;
    };

    const socialLinks = aboutData?.social_links ? JSON.parse(aboutData.social_links) : {};

    return (
        <div ref={containerRef} className="min-h-screen w-full flex flex-col items-center justify-center relative p-4 md:p-8 overflow-y-auto">
            {/* Vanta Background */}
            <div ref={bgRef} className="fixed inset-0" />

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full max-w-7xl h-auto md:h-[70vh] my-24 md:my-0">

                {/* Resume Card (Left) */}
                <Link to="/resume" ref={resumeRef} className="group relative w-full md:w-1/5 h-48 md:h-3/5 bg-glass backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 order-2 md:order-1">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors">Resume</h2>
                    </div>
                </Link>

                {/* About Card (Center - Larger with Glass Effect) */}
                <div ref={aboutRef} className="relative w-full md:w-3/5 h-[650px] md:h-full bg-glass dark:bg-blue-900/40 backdrop-blur-lg rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 order-1 md:order-2">
                    {/* Avatar */}
                    {aboutData?.avatar_image && (
                        <div className="mb-4">
                            <img
                                src={`data:image/jpeg;base64,${aboutData.avatar_image}`}
                                alt="Avatar"
                                className="w-48 h-48 rounded-full object-cover border-4 border-white/30 shadow-xl"
                            />
                        </div>
                    )}

                    {/* Name & Occupation */}
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
                        {aboutData?.name || 'Your Name'}
                    </h2>
                    <p className="text-lg text-accent mb-6 font-medium">
                        {aboutData?.occupation || 'Your Occupation'}
                    </p>

                    {/* Title & Description */}

                    <p className="text-base md:text-lg text-primary text-center max-w-lg leading-relaxed mb-6">
                        {aboutData?.description || 'Passionate developer crafting digital experiences.'}
                    </p>

                    {/* Technology Carousel */}
                    {technologies.length > 0 && (
                        <div className="w-full max-w-xs mb-6">
                            <h3 className="text-sm uppercase tracking-wider text-primary text-center mb-4 font-semibold">
                                Tech Stack
                            </h3>
                            <Swiper
                                effect={'coverflow'}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={'auto'}
                                coverflowEffect={{
                                    rotate: 50,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 1,
                                    slideShadows: true,
                                }}
                                autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                                }}
                                loop={technologies.length >= 3}
                                modules={[EffectCoverflow, Autoplay]}
                                className="tech-swiper"
                            >
                                {technologies.map((tech) => (
                                    <SwiperSlide key={tech.id} className="!w-24 !h-24">
                                        <div className="w-full h-full rounded-xl flex flex-col items-center justify-center p-3 border border-white/20">
                                            {tech.image && (
                                                <img
                                                    src={`data:image/png;base64,${tech.image}`}
                                                    alt={tech.title}
                                                    className="w-12 h-12 object-contain mb-2"
                                                />
                                            )}
                                            <span className="text-xs font-medium text-accent text-center">
                                                {tech.title}
                                            </span>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}

                    {/* Social Links */}
                    {Object.keys(socialLinks).length > 0 && (
                        <div className="flex gap-4 mb-6">
                            {Object.entries(socialLinks).map(([platform, url]) => {
                                const Icon = getSocialIcon(platform);
                                return (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-surface/20 rounded-lg hover:bg-white/30 dark:hover:bg-slate-600/40 transition-all hover:scale-110"
                                        title={platform}
                                    >
                                        <Icon size={20} className="text-secondary" />
                                    </a>
                                );
                            })}
                        </div>
                    )}

                    {/* Link to Showcasing at bottom */}
                    <Link to="/showcasing" className="absolute bottom-8 text-sm uppercase tracking-widest text-primary  transition-colors font-semibold">
                        View Showcasing →
                    </Link>
                </div>

                {/* Calendar Card (Right) */}
                <Link to="/calendar" ref={calendarRef} className="group relative w-full md:w-1/5 h-48 md:h-3/5 bg-glass backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-500 order-3 md:order-3">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors">Calendar</h2>
                    </div>
                </Link>

            </div>
        </div>
    );
};

export default Home;
