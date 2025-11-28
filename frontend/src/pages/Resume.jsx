import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
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

    // Fallback if no data
    if (!resumeData) return <div className="text-white text-center p-10">Loading Resume...</div>;

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 pt-24 pb-8 px-8 flex justify-center overflow-y-auto">
            <div className="w-full max-w-[210mm] bg-white shadow-2xl min-h-[297mm] p-10 relative">

                {/* Header / Personal Info */}
                <div className="border-b-2 border-slate-300 pb-6 mb-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-blue-900 uppercase tracking-wide">{resumeData.name || "John Doe"}</h1>
                        <p className="text-xl text-slate-600 mt-2">{resumeData.title || "Fullstack Developer"}</p>
                        <div className="mt-4 text-sm text-slate-600 space-y-1">
                            <p>📍 {resumeData.location || "New York, USA"}</p>
                            <p>📧 {resumeData.email || "john.doe@example.com"}</p>
                            <p>📱 {resumeData.phone || "+1 234 567 890"}</p>
                        </div>
                    </div>
                    <div className="w-32 h-32 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img src={resumeData.image || "https://via.placeholder.com/150"} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Sections */}
                <div className="grid grid-cols-[1fr_2fr] gap-8">

                    {/* Left Column */}
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-blue-900 font-bold border-b border-slate-300 pb-1 mb-3 uppercase text-sm">Skills</h3>
                            <ul className="text-sm space-y-2">
                                {resumeData.skills?.map((skill, i) => (
                                    <li key={i}><span className="font-semibold">{skill.category}:</span> {skill.items}</li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-blue-900 font-bold border-b border-slate-300 pb-1 mb-3 uppercase text-sm">Languages</h3>
                            <ul className="text-sm space-y-2">
                                {resumeData.languages?.map((lang, i) => (
                                    <li key={i} className="flex justify-between"><span>{lang.name}</span> <span className="text-slate-500">{lang.level}</span></li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-blue-900 font-bold border-b border-slate-300 pb-1 mb-3 uppercase text-sm">Work Experience</h3>
                            {resumeData.experience?.map((exp, i) => (
                                <div key={i} className="mb-4">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-lg">{exp.role}</h4>
                                        <span className="text-sm text-slate-500">{exp.period}</span>
                                    </div>
                                    <p className="text-blue-800 text-sm font-medium mb-2">{exp.company}</p>
                                    <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                                        {exp.achievements?.map((ach, j) => <li key={j}>{ach}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        <section>
                            <h3 className="text-blue-900 font-bold border-b border-slate-300 pb-1 mb-3 uppercase text-sm">Education</h3>
                            {resumeData.education?.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold">{edu.degree}</h4>
                                        <span className="text-sm text-slate-500">{edu.period}</span>
                                    </div>
                                    <p className="text-sm text-slate-700">{edu.institution}</p>
                                </div>
                            ))}
                        </section>
                    </div>

                </div>

                {/* Floating Action Button for Download (UI only) */}
                <button className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-colors print:hidden">
                    <Download />
                </button>

            </div>
        </div>
    );
};

export default Resume;
