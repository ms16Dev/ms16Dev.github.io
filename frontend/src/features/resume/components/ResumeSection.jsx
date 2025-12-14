const ResumeSection = ({ title, children }) => {
    if (!children) return null;

    return (
        <section className="mb-8">
            <h2 className="text-blue-900 font-bold text-lg border-b-2 border-blue-900 pb-1 mb-4 uppercase">
                {title}
            </h2>
            {children}
        </section>
    );
};

export default ResumeSection;
