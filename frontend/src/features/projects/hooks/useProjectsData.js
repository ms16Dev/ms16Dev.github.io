import { useState, useCallback } from 'react';
import { getProjects } from '@/core/api/api';

export const useProjectsData = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProjectsData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getProjects();
            setProjects(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        projects,
        loading,
        error,
        fetchProjectsData
    };
};
