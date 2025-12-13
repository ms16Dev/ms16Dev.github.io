import { useState, useCallback } from 'react';
import {
    getAbout,
    updateAbout as apiUpdateAbout,
    getAboutTechnologies,
    addAboutTechnology,
    deleteAboutTechnology
} from '@/core/api/api';
import { useToast } from '@/core/context/ToastContext';

export const useAbout = () => {
    const [aboutData, setAboutData] = useState({ name: '', occupation: '', title: '', description: '', social_links: '[]', avatar_image: null });
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const fetchAboutData = useCallback(async () => {
        setLoading(true);
        try {
            const [aboutRes, techRes] = await Promise.all([getAbout(), getAboutTechnologies()]);
            if (aboutRes) setAboutData(aboutRes);
            setTechnologies(techRes);
        } catch (err) {
            console.error(err);
            addToast('Failed to fetch About data', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const updateAbout = async (formData) => {
        setLoading(true);
        try {
            await apiUpdateAbout(formData);
            addToast('About section updated!', 'success');
            await fetchAboutData();
            return true;
        } catch (err) {
            console.error(err);
            addToast('Failed to update About', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const addTechnology = async (formData) => {
        setLoading(true);
        try {
            await addAboutTechnology(formData);
            addToast('Technology added!', 'success');
            await fetchAboutData();
            return true;
        } catch (err) {
            console.error(err);
            addToast('Failed to add technology', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteTechnology = async (id) => {
        setLoading(true);
        try {
            await deleteAboutTechnology(id);
            setTechnologies(prev => prev.filter(t => t.id !== id));
            addToast('Technology deleted', 'success');
            return true;
        } catch (err) {
            console.error(err);
            addToast('Failed to delete technology', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Unified toast helper for validations in component
    const notify = (message, type = 'info') => addToast(message, type);

    return {
        aboutData,
        technologies,
        loading,
        fetchAboutData,
        updateAbout,
        addTechnology,
        deleteTechnology,
        notify
    };
};
