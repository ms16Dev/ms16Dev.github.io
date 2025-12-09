import { useState, useEffect } from 'react';
import { Folder } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProjects } from '../hooks/useProjects';
import { projectSchema } from '../schemas';

const AdminProjects = () => {
    const { projects, fetchProjects, createProject, updateProject, deleteProject } = useProjects();
    const [editingId, setEditingId] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '', start_date: '', end_date: '', description: '', tags: '', background_image_url: ''
        }
    });

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const onSubmit = async (data) => {
        let success;
        if (editingId) {
            success = await updateProject(editingId, data);
        } else {
            success = await createProject(data);
        }
        if (success) {
            reset();
            setEditingId(null);
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);
        setValue('title', project.title);
        setValue('start_date', project.start_date || '');
        setValue('end_date', project.end_date || '');
        setValue('description', project.description || '');
        setValue('tags', project.tags || '');
        setValue('background_image_url', project.background_image_url || '');
    };

    const handleCancel = () => {
        reset();
        setEditingId(null);
    };

    const inputClass = "w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm";
    const labelClass = "block text-sm font-medium mb-2 text-accent";

    return (
        <div className="space-y-8 animate-fadeIn">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 border-b border-white/20 pb-8">
                <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                    <Folder size={32} /> {editingId ? 'Edit Project' : 'Add New Project'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className={labelClass}>Title</label>
                        <input
                            type="text"
                            className={inputClass}
                            {...register('title')}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Start Date</label>
                        <input
                            type="date"
                            className={inputClass}
                            {...register('start_date')}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>End Date</label>
                        <input
                            type="date"
                            className={inputClass}
                            {...register('end_date')}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Description</label>
                        <textarea
                            className={`${inputClass} h-32 resize-none`}
                            {...register('description')}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Tags</label>
                        <input
                            type="text"
                            className={inputClass}
                            {...register('tags')}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Image URL</label>
                        <input
                            type="text"
                            className={inputClass}
                            {...register('background_image_url')}
                        />
                        {errors.background_image_url && <p className="text-red-500 text-xs mt-1">{errors.background_image_url.message}</p>}
                    </div>
                </div>
                <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-secondary/25 hover:scale-105 transition-all">
                        {editingId ? 'Update Project' : 'Create Project'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={handleCancel} className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-slate-700/50 transition-all">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div>
                <h3 className="text-xl font-bold mb-6 text-secondary">Existing Projects</h3>
                <div className="grid gap-4">
                    {projects.map(project => (
                        <div key={project.id} className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl border border-white/20 dark:border-slate-700 flex justify-between items-center hover:bg-white/50 dark:hover:bg-slate-800/60 transition-colors">
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{project.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{project.start_date} - {project.end_date}</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handleEdit(project)} className="text-secondary hover:text-secondary/80 font-medium">Edit</button>
                                <button onClick={() => deleteProject(project.id)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminProjects;
