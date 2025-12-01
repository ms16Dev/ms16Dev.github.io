import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const defaultData = {
    personalInfo: {
        fullName: '',
        professionalTitle: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: []
};

const ResumeForm = ({ resumeData, onSave }) => {
    const [formData, setFormData] = useState(defaultData);

    // Update form data when resumeData prop changes (loaded from API)
    useEffect(() => {
        if (resumeData && resumeData.personalInfo) {
            setFormData(resumeData);
        }
    }, [resumeData]);

    const handlePersonalInfoChange = (field, value) => {
        setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, [field]: value }
        });
    };

    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [...formData.experience, {
                role: '',
                company: '',
                location: '',
                period: '',
                achievements: ['']
            }]
        });
    };

    const updateExperience = (index, field, value) => {
        const updated = [...formData.experience];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, experience: updated });
    };

    const removeExperience = (index) => {
        setFormData({
            ...formData,
            experience: formData.experience.filter((_, i) => i !== index)
        });
    };

    const addAchievement = (expIndex) => {
        const updated = [...formData.experience];
        updated[expIndex].achievements.push('');
        setFormData({ ...formData, experience: updated });
    };

    const updateAchievement = (expIndex, achIndex, value) => {
        const updated = [...formData.experience];
        updated[expIndex].achievements[achIndex] = value;
        setFormData({ ...formData, experience: updated });
    };

    const removeAchievement = (expIndex, achIndex) => {
        const updated = [...formData.experience];
        updated[expIndex].achievements = updated[expIndex].achievements.filter((_, i) => i !== achIndex);
        setFormData({ ...formData, experience: updated });
    };

    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, {
                degree: '',
                institution: '',
                location: '',
                period: '',
                description: ''
            }]
        });
    };

    const updateEducation = (index, field, value) => {
        const updated = [...formData.education];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, education: updated });
    };

    const removeEducation = (index) => {
        setFormData({
            ...formData,
            education: formData.education.filter((_, i) => i !== index)
        });
    };

    const addSkill = () => {
        setFormData({
            ...formData,
            skills: [...formData.skills, { category: '', items: '' }]
        });
    };

    const updateSkill = (index, field, value) => {
        const updated = [...formData.skills];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, skills: updated });
    };

    const removeSkill = (index) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((_, i) => i !== index)
        });
    };

    const addLanguage = () => {
        setFormData({
            ...formData,
            languages: [...formData.languages, { name: '', level: 'B2' }]
        });
    };

    const updateLanguage = (index, field, value) => {
        const updated = [...formData.languages];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, languages: updated });
    };

    const removeLanguage = (index) => {
        setFormData({
            ...formData,
            languages: formData.languages.filter((_, i) => i !== index)
        });
    };

    const addCertification = () => {
        setFormData({
            ...formData,
            certifications: [...formData.certifications, {
                title: '',
                issuer: '',
                date: '',
                url: ''
            }]
        });
    };

    const updateCertification = (index, field, value) => {
        const updated = [...formData.certifications];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, certifications: updated });
    };

    const removeCertification = (index) => {
        setFormData({
            ...formData,
            certifications: formData.certifications.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const inputClass = "w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm";
    const labelClass = "block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300";
    const sectionClass = "mb-8 p-6 bg-white/30 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700";

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className={sectionClass}>
                <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Full Name *</label>
                        <input
                            type="text"
                            className={inputClass}
                            value={formData.personalInfo.fullName}
                            onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Professional Title *</label>
                        <input
                            type="text"
                            className={inputClass}
                            value={formData.personalInfo.professionalTitle}
                            onChange={(e) => handlePersonalInfoChange('professionalTitle', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Email *</label>
                        <input
                            type="email"
                            className={inputClass}
                            value={formData.personalInfo.email}
                            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Phone</label>
                        <input
                            type="tel"
                            className={inputClass}
                            value={formData.personalInfo.phone}
                            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Location</label>
                        <input
                            type="text"
                            className={inputClass}
                            value={formData.personalInfo.location}
                            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Professional Summary</label>
                        <textarea
                            className={`${inputClass} h-32 resize-none`}
                            value={formData.personalInfo.summary}
                            onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Work Experience */}
            <div className={sectionClass}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Work Experience</h3>
                    <button
                        type="button"
                        onClick={addExperience}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
                    >
                        <Plus size={18} /> Add Experience
                    </button>
                </div>
                {formData.experience.map((exp, index) => (
                    <div key={index} className="mb-6 p-4 bg-white/40 dark:bg-slate-700/40 rounded-xl relative">
                        <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className={labelClass}>Role/Position</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={exp.role}
                                    onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Company</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={exp.company}
                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Location</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={exp.location}
                                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Period (e.g., 2020-2023)</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={exp.period}
                                    onChange={(e) => updateExperience(index, 'period', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className={labelClass}>Key Achievements</label>
                                <button
                                    type="button"
                                    onClick={() => addAchievement(index)}
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    + Add Achievement
                                </button>
                            </div>
                            {exp.achievements.map((ach, achIndex) => (
                                <div key={achIndex} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={ach}
                                        onChange={(e) => updateAchievement(index, achIndex, e.target.value)}
                                        placeholder="Describe an achievement..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeAchievement(index, achIndex)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Education */}
            <div className={sectionClass}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Education</h3>
                    <button
                        type="button"
                        onClick={addEducation}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
                    >
                        <Plus size={18} /> Add Education
                    </button>
                </div>
                {formData.education.map((edu, index) => (
                    <div key={index} className="mb-4 p-4 bg-white/40 dark:bg-slate-700/40 rounded-xl relative">
                        <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Degree/Qualification</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Institution</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={edu.institution}
                                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Location</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={edu.location}
                                    onChange={(e) => updateEducation(index, 'location', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Period</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={edu.period}
                                    onChange={(e) => updateEducation(index, 'period', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Description</label>
                                <textarea
                                    className={`${inputClass} h-20 resize-none`}
                                    value={edu.description}
                                    onChange={(e) => updateEducation(index, 'description', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div className={sectionClass}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Skills</h3>
                    <button
                        type="button"
                        onClick={addSkill}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
                    >
                        <Plus size={18} /> Add Skill Category
                    </button>
                </div>
                {formData.skills.map((skill, index) => (
                    <div key={index} className="mb-4 p-4 bg-white/40 dark:bg-slate-700/40 rounded-xl relative">
                        <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Category</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={skill.category}
                                    onChange={(e) => updateSkill(index, 'category', e.target.value)}
                                    placeholder="e.g., Programming"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Skills (comma-separated)</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={skill.items}
                                    onChange={(e) => updateSkill(index, 'items', e.target.value)}
                                    placeholder="e.g., JavaScript, Python, React"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Languages */}
            <div className={sectionClass}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Languages</h3>
                    <button
                        type="button"
                        onClick={addLanguage}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
                    >
                        <Plus size={18} /> Add Language
                    </button>
                </div>
                {formData.languages.map((lang, index) => (
                    <div key={index} className="mb-4 p-4 bg-white/40 dark:bg-slate-700/40 rounded-xl relative">
                        <button
                            type="button"
                            onClick={() => removeLanguage(index)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Language</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={lang.name}
                                    onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Proficiency Level</label>
                                <select
                                    className={inputClass}
                                    value={lang.level}
                                    onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                                >
                                    <option value="A1">A1 - Beginner</option>
                                    <option value="A2">A2 - Elementary</option>
                                    <option value="B1">B1 - Intermediate</option>
                                    <option value="B2">B2 - Upper Intermediate</option>
                                    <option value="C1">C1 - Advanced</option>
                                    <option value="C2">C2 - Proficient</option>
                                    <option value="Native">Native</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Certifications */}
            <div className={sectionClass}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Certifications (Optional)</h3>
                    <button
                        type="button"
                        onClick={addCertification}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
                    >
                        <Plus size={18} /> Add Certification
                    </button>
                </div>
                {formData.certifications.map((cert, index) => (
                    <div key={index} className="mb-4 p-4 bg-white/40 dark:bg-slate-700/40 rounded-xl relative">
                        <button
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Certification Title</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={cert.title}
                                    onChange={(e) => updateCertification(index, 'title', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Issuer</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={cert.issuer}
                                    onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Date</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={cert.date}
                                    onChange={(e) => updateCertification(index, 'date', e.target.value)}
                                    placeholder="e.g., June 2023"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Verification URL (optional)</label>
                                <input
                                    type="url"
                                    className={inputClass}
                                    value={cert.url}
                                    onChange={(e) => updateCertification(index, 'url', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all"
            >
                Save Resume
            </button>
        </form>
    );
};

export default ResumeForm;
