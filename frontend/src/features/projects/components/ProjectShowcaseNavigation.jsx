import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ProjectShowcaseNavigation = ({
    projects,
    currentIndex,
    onNext,
    onPrev,
    isAnimating
}) => {
    return (
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
            <button
                onClick={onPrev}
                disabled={isAnimating}
                className="p-3 md:p-4 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Previous project"
            >
                <ChevronUp className="text-white group-hover:text-accent transition-colors" size={24} />
            </button>

            <div className="flex flex-col items-center gap-2 py-2 md:py-4">
                {projects.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-1.5 rounded-full transition-all duration-500 ease-out ${idx === currentIndex
                                ? 'h-6 md:h-8 bg-accent shadow-[0_0_10px_rgba(var(--accent),0.5)]'
                                : 'h-1.5 bg-white/20'
                            }`}
                    />
                ))}
            </div>

            <button
                onClick={onNext}
                disabled={isAnimating}
                className="p-3 md:p-4 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Next project"
            >
                <ChevronDown className="text-white group-hover:text-accent transition-colors" size={24} />
            </button>


        </div>
    );
};

export default ProjectShowcaseNavigation;
