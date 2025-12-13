import ResumeSection from './ResumeSection';

const EducationSection = ({ education }) => {
    if (!education?.length) return null;

    return (
        <ResumeSection title="Education">
            {education.map((edu, index) => (
                <div key={index} className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-slate-900">
                            {edu.degree}
                        </h3>
                        <span className="text-sm text-slate-500">
                            {edu.period}
                        </span>
                    </div>

                    <p className="text-blue-800 font-medium">
                        {edu.institution}
                    </p>

                    {edu.location && (
                        <p className="text-sm text-slate-600">
                            {edu.location}
                        </p>
                    )}

                    {edu.description && (
                        <p className="text-sm text-slate-700 mt-1">
                            {edu.description}
                        </p>
                    )}
                </div>
            ))}
        </ResumeSection>
    );
};

export default EducationSection;
