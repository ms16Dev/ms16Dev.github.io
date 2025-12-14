import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { getEventColor } from '@/utils/colors';
import { formatDateRange } from '@/utils/dateUtils';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const ProjectShowcaseInfo = ({ project, titleRef, detailsRef }) => {
    if (!project) return null;

    return (
        <div className="space-y-8 w-full max-w-full overflow-hidden">
            <div ref={titleRef} className="w-full">
                <div className="inline-block px-3 py-1 md:px-4 md:py-1 rounded-full bg-accent text-white text-xs md:text-sm font-mono mb-3 md:mb-4 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {formatDateRange(project.start_date, project.end_date)}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight break-words overflow-wrap-anywhere">
                    {project.title}
                </h1>
            </div>

            <div ref={detailsRef} className="space-y-6 w-full">
                <p className="text-base md:text-lg text-slate-200 leading-relaxed w-full max-w-xl break-words">
                    {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-4 py-2">
                        {project.technologies.map((tech) => (
                            <div key={tech.id} className="relative group">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 p-2 overflow-hidden border border-white/10 group-hover:border-accent/50 transition-colors backdrop-blur-sm">
                                    <img
                                        src={`${API_BASE_URL}/technologies/${tech.id}/image`}
                                        alt={tech.title}
                                        className="w-full h-full object-contain"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-20 border border-white/10">
                                    {tech.title}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tags 
                {project.tags && (
                    <div className="flex flex-wrap gap-2 w-full">
                        {project.tags.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, i) => (
                            <span
                                key={i}
                                className={`px-4 py-1.5 rounded-full text-white text-sm font-medium shadow-sm transition-transform hover:scale-105 ${getEventColor(i)}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                    */}

                {/* Buttons */}
                <div className="flex items-center gap-4 mt-8 pt-4">
                    {project.github_link && (
                        <a
                            href={project.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all hover:scale-105 active:scale-95 text-white backdrop-blur-md"
                        >
                            <Github size={20} />
                            <span className="font-medium">GitHub</span>
                        </a>
                    )}

                    {project.live_demo_link && (
                        <a
                            href={project.live_demo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-accent/80 hover:bg-accent border border-accent/50 rounded-xl transition-all hover:scale-105 active:scale-95 text-white shadow-lg shadow-accent/20"
                        >
                            <ExternalLink size={20} />
                            <span className="font-medium">Live Demo</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectShowcaseInfo;
