import { useState, useCallback } from 'react';
import { getResume, uploadResume } from '@/core/api/api';
import { useToast } from '@/core/context/ToastContext';

export const useResume = () => {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const fetchResume = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getResume();
            if (data && data.content) {
                try {
                    setResumeData(JSON.parse(data.content));
                } catch (e) {
                    setResumeData(null);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateResume = async (formData) => {
        setLoading(true);
        try {
            await uploadResume({ content: JSON.stringify(formData) });
            addToast('Resume updated successfully!', 'success');
            fetchResume();
            return true;
        } catch (err) {
            console.error(err);
            addToast('Failed to update resume.', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        resumeData,
        loading,
        fetchResume,
        updateResume
    };
};
