import ResumeSection from './ResumeSection';

const SkillsSection = ({ skills }) => {
    if (!skills?.length) return null;

    return (
        <ResumeSection title="Skills">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skills.map((skill, index) => (
                    <div key={index}>
                        <span className="font-semibold text-slate-900">
                            {skill.category}:
                        </span>{' '}
                        <span className="text-sm text-slate-700">
                            {skill.items}
                        </span>
                    </div>
                ))}
            </div>
        </ResumeSection>
    );
};

export default SkillsSection;
