import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const HomeAboutCard = ({ aboutData, technologies }) => {
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
        <div className="relative w-full h-full bg-glass dark:bg-blue-900/40 backdrop-blur-lg rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 border border-white/10 shadow-2xl">
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
    );
};

export default HomeAboutCard;
