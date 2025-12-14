import ResumeSection from './ResumeSection';

const ExperienceSection = ({ experience }) => {
    if (!experience?.length) return null;

    return (
        <ResumeSection title="Work Experience">
            {experience.map((exp, index) => (
                <div key={index} className="mb-6">
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-lg text-slate-900">
                            {exp.role}
                        </h3>
                        <span className="text-sm text-slate-500">
                            {exp.period}
                        </span>
                    </div>

                    <p className="text-blue-800 font-medium mb-1">
                        {exp.company}
                    </p>

                    {exp.location && (
                        <p className="text-sm text-slate-600 mb-2">
                            {exp.location}
                        </p>
                    )}

                    {exp.achievements?.length > 0 && (
                        <ul className="list-disc ml-5 text-sm text-slate-700 space-y-1">
                            {exp.achievements
                                .filter(Boolean)
                                .map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                        </ul>
                    )}
                </div>
            ))}
        </ResumeSection>
    );
};

export default ExperienceSection;
