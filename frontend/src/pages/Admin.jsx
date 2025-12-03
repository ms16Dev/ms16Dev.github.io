import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Folder, Calendar, FileText, Settings } from 'lucide-react';
import ResumeForm from '../components/ResumeForm';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('about');
    const [aboutData, setAboutData] = useState({ name: '', occupation: '', title: '', description: '', social_links: '[]', avatar_image: null });
    const [avatarFile, setAvatarFile] = useState(null);

    const [projectData, setProjectData] = useState({ title: '', start_date: '', end_date: '', description: '', tags: '', background_image_url: '' });
    const [calendarData, setCalendarData] = useState({ title: '', start_date: '', end_date: '', icon: '' });
    const [resumeData, setResumeData] = useState(null);
    const [settingsData, setSettingsData] = useState({ calendar_start_year: 2020, calendar_end_year: 2030 });

    const [projectsList, setProjectsList] = useState([]);
    const [eventsList, setEventsList] = useState([]);

    // Technology State
    const [technologies, setTechnologies] = useState([]);
    const [newTech, setNewTech] = useState({ title: '', image: null });

    // Fetch initial data
    const fetchData = async () => {
        try {
            const aboutRes = await axios.get('http://localhost:8000/about/');
            if (aboutRes.data) setAboutData(aboutRes.data);

            const resumeRes = await axios.get('http://localhost:8000/resume/');
            if (resumeRes.data && resumeRes.data.content) {
                try {
                    setResumeData(JSON.parse(resumeRes.data.content));
                } catch {
                    setResumeData(null);
                }
            }

            const projectsRes = await axios.get('http://localhost:8000/projects/');
            setProjectsList(projectsRes.data);

            const eventsRes = await axios.get('http://localhost:8000/calendar/');
            setEventsList(eventsRes.data);

            const settingsRes = await axios.get('http://localhost:8000/settings/');
            if (settingsRes.data) setSettingsData(settingsRes.data);

            const techRes = await axios.get('http://localhost:8000/about/technologies');
            setTechnologies(techRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveAbout = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', aboutData.name);
            formData.append('occupation', aboutData.occupation);
            formData.append('title', aboutData.title);
            formData.append('description', aboutData.description);
            formData.append('social_links', aboutData.social_links);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            await axios.post('http://localhost:8000/about/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('About section updated!');
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to update About');
        }
    };

    const handleAddTechnology = async (e) => {
        e.preventDefault();
        if (!newTech.title || !newTech.image) {
            alert("Please provide both title and image.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('title', newTech.title);
            formData.append('image', newTech.image);

            await axios.post('http://localhost:8000/about/technologies', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setNewTech({ title: '', image: null });
            // Reset file input manually if needed
            document.getElementById('tech-image-input').value = "";
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to add technology');
        }
    };

    const handleDeleteTechnology = async (id) => {
        if (!window.confirm("Delete this technology?")) return;
        try {
            await axios.delete(`http://localhost:8000/about/technologies/${id}`);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to delete technology');
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:8000/settings/', settingsData);
            alert('Settings updated!');
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to update settings');
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            if (projectData.id) {
                await axios.put(`http://localhost:8000/projects/${projectData.id}`, projectData);
                alert('Project updated!');
            } else {
                await axios.post('http://localhost:8000/projects/', projectData);
                alert('Project created!');
            }
            setProjectData({ title: '', start_date: '', end_date: '', description: '', tags: '', background_image_url: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to save project');
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await axios.delete(`http://localhost:8000/projects/${id}`);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to delete project');
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            if (calendarData.id) {
                await axios.put(`http://localhost:8000/calendar/${calendarData.id}`, calendarData);
                alert('Event updated!');
            } else {
                await axios.post('http://localhost:8000/calendar/', calendarData);
                alert('Event created!');
            }
            setCalendarData({ title: '', start_date: '', end_date: '', icon: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to save event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await axios.delete(`http://localhost:8000/calendar/${id}`);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to delete event');
        }
    };

    const handleSaveResume = async (formData) => {
        try {
            await axios.post('http://localhost:8000/resume/', { content: JSON.stringify(formData) });
            alert('Resume updated successfully!');
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to update resume.');
        }
    };

    const tabs = [
        { id: 'about', label: 'About', icon: <User size={18} /> },
        { id: 'projects', label: 'Projects', icon: <Folder size={18} /> },
        { id: 'calendar', label: 'Calendar', icon: <Calendar size={18} /> },
        { id: 'resume', label: 'Resume', icon: <FileText size={18} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    ];

    return (
        <div className="min-h-screen w-full bg-surface flex flex-col items-center pt-24 pb-8 px-4 md:px-8 overflow-y-auto relative">
 
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>

                {/* Mobile-Aware Scrollable Tabs */}
                <div className="flex justify-center mb-8 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-6 py-3 transition-all duration-300 whitespace-nowrap snap-start ${activeTab === tab.id
                                ? 'bg-glass text-secondary  border-secondary border-b border-b-4 shadow-lg '
                                : 'bg-glass text-primary hover:bg-glass-strong  hover:text-secondary  backdrop-blur-sm'
                                }`}
                        >
                            {tab.icon}
                            <span className="font-medium ps-2">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Glassmorphic Content Container */}
                <div className="bg-glass backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-2xl transition-all duration-300">

                    {activeTab === 'about' && (
                        <div className="space-y-8 animate-fadeIn">
                            <form onSubmit={handleSaveAbout} className="space-y-6">
                                <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                                    <User size={32}/> Edit About Section
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-accent">Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm"
                                            value={aboutData.name}
                                            onChange={e => setAboutData({ ...aboutData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-accent">Occupation</label>
                                        <input
                                            type="text"
                                            className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm"
                                            value={aboutData.occupation}
                                            onChange={e => setAboutData({ ...aboutData, occupation: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2 text-accent">Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm"
                                            value={aboutData.title}
                                            onChange={e => setAboutData({ ...aboutData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2 text-accent">Description</label>
                                        <textarea
                                            className="w-full bg-surface border border-accent rounded-xl p-3 text-muted h-32 focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm resize-none"
                                            value={aboutData.description}
                                            onChange={e => setAboutData({ ...aboutData, description: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-accent">Avatar Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm"
                                            onChange={e => setAvatarFile(e.target.files[0])}
                                        />
                                        {aboutData.avatar_image && (
                                            <div className="mt-2">
                                                <p className="text-xs text-accent mb-1">Current Avatar:</p>
                                                <img src={`data:image/jpeg;base64,${aboutData.avatar_image}`} alt="Current Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-accent">Social Links (JSON)</label>
                                        <textarea
                                            className="w-full bg-surface border border-accent rounded-xl p-3 text-muted h-32 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm resize-none"
                                            value={aboutData.social_links}
                                            onChange={e => setAboutData({ ...aboutData, social_links: e.target.value })}
                                            placeholder='{"github": "...", "linkedin": "..."}'
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full md:w-auto bg-secondary dark:bg-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-accent/25 hover:scale-105 transition-all">
                                    Save Changes
                                </button>
                            </form>

                            {/* Technology Management Section */}
                            <div className="border-t border-accent pt-8">
                                <h3 className="text-xl font-bold mb-6 text-secondary">Technology Experience</h3>

                                <form onSubmit={handleAddTechnology} className="mb-8 bg-glass-strong p-6 rounded-2xl border border-accent ">
                                    <h4 className="text-lg font-semibold mb-4 text-secondary">Add New Technology</h4>
                                    <div className="flex flex-col md:flex-row gap-4 items-end">
                                        <div className="flex-1 w-full">
                                            <label className="block text-sm font-medium mb-2 text-secondary">Tech Name</label>
                                            <input
                                                type="text"
                                                className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm"
                                                value={newTech.title}
                                                onChange={e => setNewTech({ ...newTech, title: e.target.value })}
                                                placeholder="e.g. React"
                                            />
                                        </div>
                                        <div className="flex-1 w-full">
                                            <label className="block text-sm font-medium mb-2 text-secondary">Icon/Image</label>
                                            <input
                                                id="tech-image-input"
                                                type="file"
                                                accept="image/*"
                                                className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm"
                                                onChange={e => setNewTech({ ...newTech, image: e.target.files[0] })}
                                            />
                                        </div>
                                        <button type="submit" className="bg-secondary dark:bg-accent text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-accent/25 transition-all">
                                            Add
                                        </button>
                                    </div>
                                </form>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {technologies.map(tech => (
                                        <div key={tech.id} className="bg-surface p-4 rounded-xl border border-accent flex flex-col items-center gap-3 hover-bg-surface-2 transition-colors relative group">
                                            {tech.image && (
                                                <img src={`data:image/jpeg;base64,${tech.image}`} alt={tech.title} className="w-12 h-12 object-contain" />
                                            )}
                                            <span className="font-medium text-secondary">{tech.title}</span>
                                            <button
                                                onClick={() => handleDeleteTechnology(tech.id)}
                                                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700 bg-white dark:bg-slate-900 rounded-full p-1"
                                            >
                                                <Settings size={14} className="rotate-45" /> {/* Using Settings as X icon for now or import X */}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <form onSubmit={handleSaveSettings} className="space-y-6 animate-fadeIn">
                            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                                <Settings size={32} /> Calendar Settings
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-secondary">Start Year</label>
                                    <input
                                        type="number"
                                        className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm"
                                        value={settingsData.calendar_start_year}
                                        onChange={e => setSettingsData({ ...settingsData, calendar_start_year: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-secondary">End Year</label>
                                    <input
                                        type="number"
                                        className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm"
                                        value={settingsData.calendar_end_year}
                                        onChange={e => setSettingsData({ ...settingsData, calendar_end_year: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full md:w-auto bg-secondary dark:bg-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-accent/25 hover:scale-105 transition-all">
                                Save Settings
                            </button>
                        </form>
                    )}

                    {activeTab === 'projects' && (
                        <div className="space-y-8 animate-fadeIn">
                            <form onSubmit={handleCreateProject} className="space-y-6 border-b border-accent pb-8">
                                <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                                    <Folder size={32} /> {projectData.id ? 'Edit Project' : 'Add New Project'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2 text-accent">Title</label>
                                        <input type="text" className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm" value={projectData.title} onChange={e => setProjectData({ ...projectData, title: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-accent">Start Date</label>
                                        <input type="date" className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm" value={projectData.start_date} onChange={e => setProjectData({ ...projectData, start_date: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-accent">End Date</label>
                                        <input type="date" className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm" value={projectData.end_date} onChange={e => setProjectData({ ...projectData, end_date: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2 text-accent">Description</label>
                                        <textarea className="w-full bg-surface border border-accent rounded-xl p-3 text-muted h-32 focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm resize-none" value={projectData.description} onChange={e => setProjectData({ ...projectData, description: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-accent">Tags</label>
                                        <input type="text" className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm" value={projectData.tags} onChange={e => setProjectData({ ...projectData, tags: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-accent">Image URL</label>
                                        <input type="text" className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm" value={projectData.background_image_url} onChange={e => setProjectData({ ...projectData, background_image_url: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="submit" className="flex-1 bg-secondary dark:bg-accent text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-accent/25 hover:scale-105 transition-all">
                                        {projectData.id ? 'Update Project' : 'Create Project'}
                                    </button>
                                    {projectData.id && (
                                        <button type="button" onClick={() => setProjectData({ title: '', start_date: '', end_date: '', description: '', tags: '', background_image_url: '' })} className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-slate-700/50 transition-all">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div>
                                <h3 className="text-xl font-bold mb-6 text-secondary">Existing Projects</h3>
                                <div className="grid gap-4">
                                    {projectsList.map(project => (
                                        <div key={project.id} className="bg-surface p-4 rounded-xl border border-accent flex justify-between items-center hover-bg-surface-2 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-secondary">{project.title}</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{project.start_date} - {project.end_date}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => setProjectData(project)} className="text-accent hover:text-accent/80 font-medium">Edit</button>
                                                <button onClick={() => handleDeleteProject(project.id)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'calendar' && (
                        <div className="space-y-8 animate-fadeIn">
                            <form onSubmit={handleCreateEvent} className="space-y-6 border-b border-accent pb-8">
                                <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                                    <Calendar size={32} /> {calendarData.id ? 'Edit Event' : 'Add Calendar Event'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2 text-accent">Title</label>
                                        <input type="text" className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm" value={calendarData.title} onChange={e => setCalendarData({ ...calendarData, title: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-accent">Start Date</label>
                                        <input type="date" className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm" value={calendarData.start_date} onChange={e => setCalendarData({ ...calendarData, start_date: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-accent">End Date</label>
                                        <input type="date" className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm" value={calendarData.end_date} onChange={e => setCalendarData({ ...calendarData, end_date: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-accent">Icon (Emoji)</label>
                                        <input type="text" className="w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm" value={calendarData.icon} onChange={e => setCalendarData({ ...calendarData, icon: e.target.value })} />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="submit" className="flex-1 bg-gradient-to-r bg-secondary dark:bg-accent text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-accent/25 hover:scale-105 transition-all">
                                        {calendarData.id ? 'Update Event' : 'Create Event'}
                                    </button>
                                    {calendarData.id && (
                                        <button type="button" onClick={() => setCalendarData({ title: '', start_date: '', end_date: '', icon: '' })} className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-slate-700/50 transition-all">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div>
                                <h3 className="text-xl font-bold mb-6 text-secondary">Existing Events</h3>
                                <div className="grid gap-4">
                                    {eventsList.map(event => (
                                        <div key={event.id} className="bg-surface p-4 rounded-xl border border-accent flex justify-between items-center hover-bg-surface-2 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <span className="text-3xl bg-white/50 dark:bg-slate-700/50 p-2 rounded-lg">{event.icon}</span>
                                                <div>
                                                    <h4 className="font-bold text-secondary">{event.title}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{event.start_date} - {event.end_date}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => setCalendarData(event)} className="text-accent hover:text-accent/80 font-medium">Edit</button>
                                                <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'resume' && (
                        <div className="animate-fadeIn">
                            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                                <FileText size={32} /> Edit Resume
                            </h2>
                            <ResumeForm resumeData={resumeData} onSave={handleSaveResume} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
