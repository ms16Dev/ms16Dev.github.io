import { Mail, MapPin, Phone } from 'lucide-react';

const ResumeHeader = ({ personalInfo }) => {
    if (!personalInfo) return null;

    return (
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-blue-900 uppercase tracking-wide mb-2">
                {personalInfo.fullName}
            </h1>

            <p className="text-xl text-slate-700 font-medium mb-4">
                {personalInfo.professionalTitle}
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
    );
};

export default ResumeHeader;
