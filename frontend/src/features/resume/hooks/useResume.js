import { useState, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../../../context/ToastContext';

const RESUME_URL = 'http://localhost:8000/resume/';

export const useResume = () => {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const fetchResume = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(RESUME_URL);
            if (response.data && response.data.content) {
                try {
                    setResumeData(JSON.parse(response.data.content));
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
            await axios.post(RESUME_URL, { content: JSON.stringify(formData) });
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
