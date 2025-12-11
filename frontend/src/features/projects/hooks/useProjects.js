import { useState, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../../../context/ToastContext';

const API_URL = 'http://localhost:8000/projects/';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setProjects(response.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch projects');
            // addToast('Failed to fetch projects', 'error'); // Optional: don't spam toasts on load
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const createProject = async (projectData) => {
        setLoading(true);
        try {
            const response = await axios.post(API_URL, projectData);
            setProjects(prev => [...prev, response.data]); // Optimistic or append
            addToast('Project created successfully!', 'success');
            fetchProjects(); // Refresh to be sure
            return true;
        } catch (err) {
            console.error(err);
            setError('Failed to create project');
            addToast('Failed to create project', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateProject = async (id, projectData) => {
        setLoading(true);
        try {
            await axios.put(`${API_URL}${id}`, projectData);
            addToast('Project updated successfully!', 'success');
            fetchProjects();
            return true;
        } catch (err) {
            console.error(err);
            setError('Failed to update project');
            addToast('Failed to update project', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return false; // Keep confirmation here or in UI? usually UI, but logic can be here. I'll leave confirmation to UI usually, but for quick port:

        setLoading(true);
        try {
            await axios.delete(`${API_URL}${id}`);
            setProjects(prev => prev.filter(p => p.id !== id));
            addToast('Project deleted successfully', 'success');
            return true;
        } catch (err) {
            console.error(err);
            setError('Failed to delete project');
            addToast('Failed to delete project', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        projects,
        loading,
        error,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject
    };
};
