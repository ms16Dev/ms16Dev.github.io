import ResumeSection from './ResumeSection';

const LanguagesSection = ({ languages }) => {
    if (!languages?.length) return null;

    return (
        <ResumeSection title="Languages">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map((lang, index) => (
                    <div key={index} className="flex justify-between">
                        <span className="font-medium text-slate-900">
                            {lang.name}
                        </span>
                        <span className="text-sm text-slate-600">
                            {lang.level}
                        </span>
                    </div>
                ))}
            </div>
        </ResumeSection>
    );
};

export default LanguagesSection;
