import { useState, useEffect } from 'react';
import { Folder, Upload, Link as LinkIcon, Github, Database } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProjects } from '../hooks/useProjects';
import { projectSchema } from '../schemas';
import axios from 'axios';

const AdminProjects = () => {
    const { projects, fetchProjects, createProject, updateProject, deleteProject } = useProjects();
    const [editingId, setEditingId] = useState(null);
    const [technologies, setTechnologies] = useState([]);
    const [selectedTechIds, setSelectedTechIds] = useState([]);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            start_date: '',
            end_date: '',
            description: '',
            tags: '',
            github_link: '',
            live_demo_link: ''
        }
    });

    useEffect(() => {
        fetchProjects();
        fetchTechnologies();
    }, [fetchProjects]);

    const fetchTechnologies = async () => {
        try {
            const res = await axios.get('http://localhost:8000/technologies/');
            setTechnologies(res.data);
        } catch (e) {
            console.error("Failed to fetch technologies", e);
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('start_date', data.start_date || '');
        formData.append('end_date', data.end_date || '');
        formData.append('description', data.description || '');
        formData.append('tags', data.tags || '');
        formData.append('github_link', data.github_link || '');
        formData.append('live_demo_link', data.live_demo_link || '');

        if (data.background_image && data.background_image[0]) {
            formData.append('background_image', data.background_image[0]);
        }

        formData.append('technology_ids', JSON.stringify(selectedTechIds));

        let success;
        if (editingId) {
            success = await updateProject(editingId, formData);
        } else {
            success = await createProject(formData);
        }

        if (success) {
            reset();
            setEditingId(null);
            setSelectedTechIds([]);
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);
        setValue('title', project.title);
        setValue('start_date', project.start_date || '');
        setValue('end_date', project.end_date || '');
        setValue('description', project.description || '');
        setValue('tags', project.tags || '');
        setValue('github_link', project.github_link || '');
        setValue('live_demo_link', project.live_demo_link || '');
        // Clear file input as we can't set it programmatically
        setValue('background_image', null);

        // Map related technologies
        if (project.technologies) {
            setSelectedTechIds(project.technologies.map(t => t.id));
        } else {
            setSelectedTechIds([]);
        }
    };

    const handleCancel = () => {
        reset();
        setEditingId(null);
        setSelectedTechIds([]);
    };

    const toggleTech = (id) => {
        setSelectedTechIds(prev =>
            prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
        );
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm";
    const labelClass = "block text-sm font-medium mb-2 text-accent";

    return (
        <div className="space-y-8 animate-fadeIn text-white">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 border-b border-white/20 pb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Folder size={32} className="text-accent" /> {editingId ? 'Edit Project' : 'Add New Project'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className={labelClass}>Title</label>
                        <input type="text" className={inputClass} {...register('title')} />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Start Date</label>
                        <input type="date" className={inputClass} {...register('start_date')} />
                    </div>
                    <div>
                        <label className={labelClass}>End Date</label>
                        <input type="date" className={inputClass} {...register('end_date')} />
                    </div>

                    <div className="md:col-span-2">
                        <label className={labelClass}>Description</label>
                        <textarea className={`${inputClass} h-32 resize-none`} {...register('description')} />
                    </div>

                    <div className="md:col-span-2">
                        <label className={labelClass}>Technologies</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                            {technologies.length === 0 && <p className="text-sm text-white/50 col-span-4">No technologies found. Add them in Technology settings.</p>}
                            {technologies.map(tech => (
                                <div
                                    key={tech.id}
                                    onClick={() => toggleTech(tech.id)}
                                    className={`cursor-pointer p-2 rounded-lg border flex items-center gap-2 transition-all ${selectedTechIds.includes(tech.id)
                                            ? 'bg-accent/20 border-accent text-accent'
                                            : 'bg-transparent border-white/5 text-slate-300 hover:bg-white/5'
                                        }`}
                                >
                                    {/* Tech Icon/Image */}
                                    <div className="w-6 h-6 rounded bg-white/10 overflow-hidden flex-shrink-0">
                                        {/* If tech.image exists (it's bytes in db, served via endpoint) */}
                                        <img src={`http://localhost:8000/technologies/${tech.id}/image`} alt={tech.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                    </div>
                                    <span className="text-sm font-medium truncate">{tech.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className={labelClass}>Background Image</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent/80`}
                                {...register('background_image')}
                            />
                            <div className="absolute right-3 top-3 pointer-events-none text-white/30">
                                <Upload size={20} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Tags (comma separated)</label>
                        <input type="text" className={inputClass} {...register('tags')} />
                    </div>
                    <div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>GitHub Link</label>
                                <div className="relative">
                                    <input type="text" className={inputClass} {...register('github_link')} placeholder="https://github.com/..." />
                                    <Github className="absolute right-3 top-3 text-white/30" size={18} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Live Demo Link</label>
                                <div className="relative">
                                    <input type="text" className={inputClass} {...register('live_demo_link')} placeholder="https://..." />
                                    <LinkIcon className="absolute right-3 top-3 text-white/30" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-accent/80 hover:bg-accent text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-accent/25 hover:scale-[1.02] transition-all">
                        {editingId ? 'Update Project' : 'Create Project'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={handleCancel} className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:bg-white/10 transition-all border border-white/10">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Database size={24} className="text-accent" /> Existing Projects
                </h3>
                <div className="grid gap-4">
                    {projects.map(project => (
                        <div key={project.id} className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-accent/30 transition-colors">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-16 h-16 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                                    {project.background_image_url ? (
                                        <img src={project.background_image_url} alt={project.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20"><Folder /></div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-white">{project.title}</h4>
                                    <p className="text-sm text-slate-400">{project.start_date} {project.end_date && `- ${project.end_date}`}</p>
                                    <div className="flex gap-2 mt-2">
                                        {project.technologies && project.technologies.map(t => (
                                            <span key={t.id} className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/5">
                                                {t.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto justify-end">
                                <button onClick={() => handleEdit(project)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">Edit</button>
                                <button onClick={() => deleteProject(project.id)} className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors border border-red-500/20">Delete</button>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="text-center py-10 text-white/30 border border-dashed border-white/10 rounded-xl">
                            No projects found. Create one above!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProjects;
