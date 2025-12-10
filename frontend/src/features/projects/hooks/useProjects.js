import { useState, useCallback } from 'react';
import { getProjects, createProject as apiCreateProject, updateProject as apiUpdateProject, deleteProject as apiDeleteProject } from '../../../api/api';
import { useToast } from '../../../context/ToastContext';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getProjects();
            setProjects(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = async (projectData) => {
        setLoading(true);
        try {
            const response = await apiCreateProject(projectData);
            setProjects(prev => [...prev, response]);
            addToast('Project created successfully!', 'success');
            fetchProjects();
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
            await apiUpdateProject(id, projectData);
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
        if (!window.confirm("Are you sure you want to delete this project?")) return false;

        setLoading(true);
        try {
            await apiDeleteProject(id);
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
