import { useState, useCallback } from 'react';
import { getAbout, updateAbout as apiUpdateAbout, getAboutTechnologies, addAboutTechnology, deleteAboutTechnology } from '../../../api/api';
import { useToast } from '../../../context/ToastContext';

export const useAbout = () => {
    const [aboutData, setAboutData] = useState({ name: '', occupation: '', title: '', description: '', social_links: '[]', avatar_image: null });
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const fetchAboutData = useCallback(async () => {
        setLoading(true);
        try {
            const [aboutData, techData] = await Promise.all([
                getAbout(),
                getAboutTechnologies()
            ]);
            if (aboutData) setAboutData(aboutData);
            setTechnologies(techData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAbout = async (formData) => {
        setLoading(true);
        try {
            await apiUpdateAbout(formData);
            addToast('About section updated!', 'success');
            fetchAboutData();
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
            fetchAboutData();
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

    return {
        aboutData,
        technologies,
        loading,
        fetchAboutData,
        updateAbout,
        addTechnology,
        deleteTechnology
    };
};
