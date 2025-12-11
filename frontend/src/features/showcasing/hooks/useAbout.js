import { useState, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../../../context/ToastContext';

const ABOUT_URL = 'http://localhost:8000/about/';
const TECH_URL = 'http://localhost:8000/about/technologies';

export const useAbout = () => {
    const [aboutData, setAboutData] = useState({ name: '', occupation: '', title: '', description: '', social_links: '[]', avatar_image: null });
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const fetchAboutData = useCallback(async () => {
        setLoading(true);
        try {
            const [aboutRes, techRes] = await Promise.all([
                axios.get(ABOUT_URL),
                axios.get(TECH_URL)
            ]);
            if (aboutRes.data) setAboutData(aboutRes.data);
            setTechnologies(techRes.data);
        } catch (err) {
            console.error(err);
            // addToast('Failed to fetch about data', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const updateAbout = async (formData) => {
        setLoading(true);
        try {
            await axios.post(ABOUT_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
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
            await axios.post(TECH_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
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
            await axios.delete(`${TECH_URL}/${id}`);
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
