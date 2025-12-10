import { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Download } from 'lucide-react';

import axios from 'axios';

const Resume = () => {
    const [resumeData, setResumeData] = useState(null);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await axios.get('http://localhost:8000/resume/');
                if (response.data && response.data.content) {
                    setResumeData(JSON.parse(response.data.content));
                }
            } catch (error) {
                console.error("Failed to fetch resume", error);
            }
        };
        fetchResume();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    // Fallback if no data
    if (!resumeData || !resumeData.personalInfo) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-center p-10 pt-24">
                <p>No resume data available. Please configure your resume in the Admin panel.</p>
            </div>
        );
    }

    const { personalInfo, experience, education, skills, languages, certifications } = resumeData;

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 pt-24 pb-8 px-4 md:px-8 flex justify-center overflow-y-auto print:pt-0 print:bg-white">
            {/* A4 Paper Container */}
            <div className="w-full max-w-[210mm] bg-white shadow-2xl min-h-[297mm] relative print:shadow-none print:min-h-0">

                {/* Europass Blue Header Bar */}
                <div className="h-3 bg-gradient-to-r from-blue-600 to-blue-800 print:block"></div>

                <div className="p-10 print:p-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-blue-900 uppercase tracking-wide mb-2">
                            {personalInfo.fullName || "Your Name"}
                        </h1>
                        <p className="text-xl text-slate-700 font-medium mb-4">
                            {personalInfo.professionalTitle || "Professional Title"}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                            {personalInfo.email && (
                                <p className="flex items-center gap-2">
                                <Mail size={16} /> {personalInfo.email}
                                </p>
                            )}

                            {personalInfo.phone && (
                                <p className="flex items-center gap-2">
                                <Phone size={16} /> {personalInfo.phone}
                                </p>
                            )}

                            {personalInfo.location && (
                                <p className="flex items-center gap-2">
                                <MapPin size={16} /> {personalInfo.location}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Professional Summary */}
                    {personalInfo.summary && (
                        <section className="mb-8">
                            <h2 className="text-blue-900 font-bold text-lg border-b-2 border-blue-900 pb-1 mb-3 uppercase">
                                Professional Summary
                            </h2>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                {personalInfo.summary}
                            </p>
                        </section>
                    )}

                    {/* Work Experience */}
                    {experience && experience.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-blue-900 font-bold text-lg border-b-2 border-blue-900 pb-1 mb-4 uppercase">
                                Work Experience
                            </h2>
                            {experience.map((exp, index) => (
                                <div key={index} className="mb-6">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-lg text-slate-900">{exp.role}</h3>
                                        <span className="text-sm text-slate-500">{exp.period}</span>
                                    </div>
                                    <p className="text-blue-800 font-medium mb-1">{exp.company}</p>
                                    {exp.location && <p className="text-sm text-slate-600 mb-2">{exp.location}</p>}
                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <ul className="list-disc list-outside ml-5 text-sm text-slate-700 space-y-1">
                                            {exp.achievements.filter(a => a.trim()).map((achievement, i) => (
                                                <li key={i}>{achievement}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-blue-900 font-bold text-lg border-b-2 border-blue-900 pb-1 mb-4 uppercase">
                                Education
                            </h2>
                            {education.map((edu, index) => (
                                <div key={index} className="mb-4">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                                        <span className="text-sm text-slate-500">{edu.period}</span>
                                    </div>
                                    <p className="text-blue-800 font-medium">{edu.institution}</p>
                                    {edu.location && <p className="text-sm text-slate-600">{edu.location}</p>}
                                    {edu.description && <p className="text-sm text-slate-700 mt-1">{edu.description}</p>}
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-blue-900 font-bold text-lg border-b-2 border-blue-900 pb-1 mb-4 uppercase">
                                Skills
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {skills.map((skill, index) => (
                                    <div key={index}>
                                        <span className="font-semibold text-slate-900">{skill.category}:</span>{' '}
                                        <span className="text-sm text-slate-700">{skill.items}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-blue-900 font-bold text-lg border-b-2 border-blue-900 pb-1 mb-4 uppercase">
                                Languages
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span className="font-medium text-slate-900">{lang.name}</span>
                                        <span className="text-sm text-slate-600">{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-blue-900 font-bold text-lg border-b-2 border-blue-900 pb-1 mb-4 uppercase">
                                Certifications
                            </h2>
                            {certifications.map((cert, index) => (
                                <div key={index} className="mb-3">
                                    <h3 className="font-bold text-slate-900">{cert.title}</h3>
                                    <p className="text-sm text-slate-700">
                                        {cert.issuer} • {cert.date}
                                    </p>
                                    {cert.url && (
                                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline print:text-blue-900">
                                            Verify Certificate
                                        </a>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>

            {/* Floating Download/Print Button */}
            <button
                onClick={handlePrint}
                className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-xl hover:bg-primary/80 transition-colors print:hidden z-50"
                title="Download as PDF"
            >
                <Download />
            </button>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    @page {
                        size: A4;
                        margin: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default Resume;
