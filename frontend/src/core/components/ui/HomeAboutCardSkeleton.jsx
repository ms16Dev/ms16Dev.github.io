import '@/assets/HomeAboutCardSkeleton.css';

const HomeAboutCardSkeleton = () => {
    return (
        <div className="relative w-full h-full bg-glass backdrop-blur-lg rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8">
            
            {/* Avatar Skeleton */}
            <div className="mb-4">
                <div className="w-48 h-48 rounded-full bg-gradient-to-r from-secondary/20 to-primary/40 dark:from-gray-700 dark:to-gray-600 animate-gradient-x"></div>
            </div>

            {/* Name & Occupation Skeleton */}
            <div className="w-64 h-8 bg-gradient-to-r from-secondary/20 to-primary/40 dark:from-gray-700 dark:to-gray-600 rounded-md mb-2 animate-gradient-x"></div>
            <div className="w-48 h-6 bg-gradient-to-r from-secondary/20 to-primary/40 dark:from-gray-700 dark:to-gray-600 rounded-md mb-6 animate-gradient-x"></div>

            {/* Description Skeleton */}
            <div className="w-full max-w-lg mb-6 space-y-3">
                <div className="w-full h-4 bg-gradient-to-r from-secondary/20 to-primary/40 dark:from-gray-700 dark:to-gray-600 rounded animate-gradient-x"></div>
            </div>


            {/* Social Links Skeleton */}
            <div className="flex gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-10 h-10 bg-gradient-to-r from-secondary/20 to-primary/40 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-gradient-x"></div>
                ))}
            </div>

            {/* Bottom Link Skeleton */}
            <div className="absolute bottom-6 w-32 h-4 bg-gradient-to-r from-secondary/20 to-primary/40 dark:from-gray-700 dark:to-gray-600 rounded animate-gradient-x"></div>
        </div>
    );
};

export default HomeAboutCardSkeleton;