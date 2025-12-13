import { useState, useEffect } from 'react';
import { getResume } from '@/core/api/api';

export const useResumeData = () => {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await getResume();
                if (response?.content) {
                    setResumeData(JSON.parse(response.content));
                } else {
                    setResumeData(null);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch resume');
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, []);

    return {
        resumeData,
        loading,
        error
    };
};
