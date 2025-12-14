import { useState, useEffect } from 'react';
import { User, Trash2 } from 'lucide-react';
import { useAbout } from '../hooks/useAbout';

const AdminAbout = () => {
    const {
        aboutData,
        technologies,
        fetchAboutData,
        updateAbout,
        addTechnology,
        deleteTechnology,
        notify
    } = useAbout();

    // Local state for forms
    const [localAbout, setLocalAbout] = useState({ name: '', occupation: '', title: '', description: '', social_links: '[]', avatar_image: null });
    const [avatarFile, setAvatarFile] = useState(null);
    const [newTech, setNewTech] = useState({ title: '', image: null });

    useEffect(() => {
        fetchAboutData();
    }, [fetchAboutData]);

    useEffect(() => {
        if (aboutData) setLocalAbout({ ...aboutData, avatar_image: null });
    }, [aboutData]);

    const handleSaveAbout = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', localAbout.name);
        formData.append('occupation', localAbout.occupation);
        formData.append('title', localAbout.title);
        formData.append('description', localAbout.description);
        formData.append('social_links', localAbout.social_links);
        if (avatarFile) formData.append('avatar', avatarFile);

        await updateAbout(formData);
    };

    const handleAddTechnology = async (e) => {
        e.preventDefault();
        if (!newTech.title || !newTech.image) {
            notify('Please provide both title and image.', 'warning');
            return;
        }
        const formData = new FormData();
        formData.append('title', newTech.title);
        formData.append('image', newTech.image);

        const success = await addTechnology(formData);
        if (success) {
            setNewTech({ title: '', image: null });
            const fileInput = document.getElementById('tech-image-input');
            if (fileInput) fileInput.value = "";
        }
    };

    const inputClass = "w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm";
    const labelClass = "block text-sm font-medium mb-2 text-accent";

    return (
        <div className="space-y-8 animate-fadeIn">
            <form onSubmit={handleSaveAbout} className="space-y-6">
                <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                    <User size={32} /> Edit About Section
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Name</label>
                        <input
                            type="text"
                            className={inputClass}
                            value={localAbout.name || ''}
                            onChange={e => setLocalAbout({ ...localAbout, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Occupation</label>
                        <input
                            type="text"
                            className={inputClass}
                            value={localAbout.occupation || ''}
                            onChange={e => setLocalAbout({ ...localAbout, occupation: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Title</label>
                        <input
                            type="text"
                            className={inputClass}
                            value={localAbout.title || ''}
                            onChange={e => setLocalAbout({ ...localAbout, title: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Description</label>
                        <textarea
                            className={`${inputClass} h-32 resize-none`}
                            value={localAbout.description || ''}
                            onChange={e => setLocalAbout({ ...localAbout, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Avatar Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            className={inputClass}
                            onChange={e => setAvatarFile(e.target.files[0])}
                        />
                        {aboutData.avatar_image && (
                            <div className="mt-2">
                                <p className="text-xs text-primary mb-1">Current Avatar:</p>
                                <img src={`data:image/jpeg;base64,${aboutData.avatar_image}`} alt="Current Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className={labelClass}>Social Links (JSON)</label>
                        <textarea
                            className={`${inputClass} h-32 font-mono text-xs resize-none`}
                            value={localAbout.social_links || ''}
                            onChange={e => setLocalAbout({ ...localAbout, social_links: e.target.value })}
                            placeholder='{"github": "...", "linkedin": "..."}'
                        />
                    </div>
                </div>
                <button type="submit" className="w-full md:w-auto bg-secondary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-accent/25 hover:scale-105 transition-all">
                    Save Changes
                </button>
            </form>

            <div className="border-t border-white/20 pt-8">
                <h3 className="text-xl font-bold mb-6 text-secondary">Technology Experience</h3>

                <form onSubmit={handleAddTechnology} className="mb-8 bg-white/30 dark:bg-slate-800/30 p-6 rounded-2xl border border-white/20 dark:border-slate-700">
                    <h4 className="text-lg font-semibold mb-4 text-secondary">Add New Technology</h4>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className={labelClass}>Tech Name</label>
                            <input
                                type="text"
                                className={inputClass}
                                value={newTech.title}
                                onChange={e => setNewTech({ ...newTech, title: e.target.value })}
                                placeholder="e.g. React"
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className={labelClass}>Icon/Image</label>
                            <input
                                id="tech-image-input"
                                type="file"
                                accept="image/*"
                                className={inputClass}
                                onChange={e => setNewTech({ ...newTech, image: e.target.files[0] })}
                            />
                        </div>
                        <button type="submit" className="bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-accent/25 hover:scale-105 transition-all">
                            Add
                        </button>
                    </div>
                </form>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {technologies.map(tech => (
                        <div key={tech.id} className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl border border-white/20 dark:border-slate-700 flex flex-col items-center gap-3 hover:bg-white/50 transition-colors relative group">
                            {tech.image && (
                                <img src={`data:image/jpeg;base64,${tech.image}`} alt={tech.title} className="w-12 h-12 object-contain" />
                            )}
                            <span className="font-medium text-slate-800 dark:text-slate-200">{tech.title}</span>
                            <button
                                onClick={() => deleteTechnology(tech.id)}
                                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700 bg-white dark:bg-slate-900 rounded-full p-1"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAbout;
