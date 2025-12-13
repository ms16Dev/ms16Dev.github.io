import { useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useResume } from '../hooks/useResume';
import ResumeForm from './ResumeForm';

const AdminResume = () => {
    const { resumeData, fetchResume, updateResume } = useResume();

    useEffect(() => {
        fetchResume();
    }, [fetchResume]);

    return (
        <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                <FileText size={32} /> Edit Resume
            </h2>
            <ResumeForm resumeData={resumeData} onSave={updateResume} />
        </div>
    );
};

export default AdminResume;
