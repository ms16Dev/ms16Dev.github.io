import { useResumeData } from '../hooks/useResumeData';

import ResumeHeader from '../components/ResumeHeader';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import SkillsSection from '../components/SkillsSection';
import LanguagesSection from '../components/LanguagesSection';
import CertificationsSection from '../components/CertificationsSection';
import PrintButton from '../components/PrintButton';
import ResumeSection from '../components/ResumeSection';

const Resume = () => {
    const { resumeData, loading } = useResumeData();

    if (loading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                Loading resume…
            </div>
        );
    }

    if (!resumeData?.personalInfo) {
        return (
            <div className="min-h-screen text-center p-10 pt-24">
                No resume data available.
            </div>
        );
    }

    const {
        personalInfo,
        experience,
        education,
        skills,
        languages,
        certifications
    } = resumeData;

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 pt-24 pb-8 px-4 flex justify-center print:bg-white">
            <div className="w-full max-w-[210mm] bg-white shadow-2xl print:shadow-none">
                <div className="h-3 bg-gradient-to-r from-blue-600 to-blue-800" />

                <div className="p-10 print:p-8">
                    <ResumeHeader personalInfo={personalInfo} />

                    {personalInfo.summary && (
                        <ResumeSection title="Professional Summary">
                            <p className="text-sm text-slate-700 leading-relaxed">
                                {personalInfo.summary}
                            </p>
                        </ResumeSection>
                    )}

                    <ExperienceSection experience={experience} />
                    <EducationSection education={education} />
                    <SkillsSection skills={skills} />
                    <LanguagesSection languages={languages} />
                    <CertificationsSection certifications={certifications} />
                </div>
            </div>

            <PrintButton />
        </div>
    );
};

export default Resume;
