import { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('about');
    const [aboutData, setAboutData] = useState({ title: '', description: '', image_url: '' });
    const [projectData, setProjectData] = useState({ title: '', start_date: '', end_date: '', description: '', tags: '', background_image_url: '' });
    const [calendarData, setCalendarData] = useState({ title: '', start_date: '', end_date: '', icon: '' });
    const [resumeData, setResumeData] = useState('');
    const [settingsData, setSettingsData] = useState({ calendar_start_year: 2020, calendar_end_year: 2030 });

    const [projectsList, setProjectsList] = useState([]);
    const [eventsList, setEventsList] = useState([]);

    // Fetch initial data
    const fetchData = async () => {
        try {
            const aboutRes = await axios.get('http://localhost:8000/about/');
            if (aboutRes.data) setAboutData(aboutRes.data);

            const resumeRes = await axios.get('http://localhost:8000/resume/');
            if (resumeRes.data) setResumeData(JSON.stringify(resumeRes.data, null, 2));

            const projectsRes = await axios.get('http://localhost:8000/projects/');
            setProjectsList(projectsRes.data);

            const eventsRes = await axios.get('http://localhost:8000/calendar/');
            setEventsList(eventsRes.data);

            const settingsRes = await axios.get('http://localhost:8000/settings/');
            if (settingsRes.data) setSettingsData(settingsRes.data);
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
            await axios.post('http://localhost:8000/about/', aboutData);
            alert('About section updated!');
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to update About');
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

    const handleSaveResume = async (e) => {
        e.preventDefault();
        try {
            const parsedResumeData = JSON.parse(resumeData);
            await axios.post('http://localhost:8000/resume/', parsedResumeData);
            alert('Resume updated!');
        } catch (error) {
            console.error(error);
            alert('Failed to update resume. Please check JSON format.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-24 pb-8 px-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="flex gap-4 mb-8 border-b border-slate-700 pb-4">
                {['about', 'projects', 'calendar', 'resume', 'settings'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg capitalize ${activeTab === tab ? 'bg-accent text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl max-w-2xl">
                {activeTab === 'about' && (
                    <form onSubmit={handleSaveAbout} className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Edit About Section</h2>
                        <div>
                            <label className="block text-sm mb-1">Title</label>
                            <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={aboutData.title} onChange={e => setAboutData({ ...aboutData, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Description</label>
                            <textarea className="w-full bg-slate-900 border border-slate-700 rounded p-2 h-32" value={aboutData.description} onChange={e => setAboutData({ ...aboutData, description: e.target.value })} />
                        </div>
                        <button type="submit" className="bg-green-600 px-6 py-2 rounded hover:bg-green-500">Save</button>
                    </form>
                )}

                {activeTab === 'settings' && (
                    <form onSubmit={handleSaveSettings} className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Calendar Settings</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Start Year</label>
                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={settingsData.calendar_start_year} onChange={e => setSettingsData({ ...settingsData, calendar_start_year: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">End Year</label>
                                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={settingsData.calendar_end_year} onChange={e => setSettingsData({ ...settingsData, calendar_end_year: parseInt(e.target.value) })} />
                            </div>
                        </div>
                        <button type="submit" className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500">Save Settings</button>
                    </form>
                )}

                {activeTab === 'projects' && (
                    <div className="space-y-8">
                        <form onSubmit={handleCreateProject} className="space-y-4 border-b border-slate-700 pb-8">
                            <h2 className="text-xl font-bold mb-4">{projectData.id ? 'Edit Project' : 'Add New Project'}</h2>
                            <div>
                                <label className="block text-sm mb-1">Title</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={projectData.title} onChange={e => setProjectData({ ...projectData, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Start Date</label>
                                <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={projectData.start_date} onChange={e => setProjectData({ ...projectData, start_date: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">End Date</label>
                                <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={projectData.end_date} onChange={e => setProjectData({ ...projectData, end_date: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Description</label>
                                <textarea className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={projectData.description} onChange={e => setProjectData({ ...projectData, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Tags (comma separated)</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={projectData.tags} onChange={e => setProjectData({ ...projectData, tags: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Image URL</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={projectData.background_image_url} onChange={e => setProjectData({ ...projectData, background_image_url: e.target.value })} />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500">{projectData.id ? 'Update Project' : 'Create Project'}</button>
                                {projectData.id && (
                                    <button type="button" onClick={() => setProjectData({ title: '', start_date: '', end_date: '', description: '', tags: '', background_image_url: '' })} className="bg-slate-600 px-6 py-2 rounded hover:bg-slate-500">Cancel</button>
                                )}
                            </div>
                        </form>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Existing Projects</h3>
                            <div className="space-y-4">
                                {projectsList.map(project => (
                                    <div key={project.id} className="bg-slate-900 p-4 rounded border border-slate-700 flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold">{project.title}</h4>
                                            <p className="text-sm text-slate-400">{project.start_date} - {project.end_date}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setProjectData(project)} className="text-blue-400 hover:text-blue-300">Edit</button>
                                            <button onClick={() => handleDeleteProject(project.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <div className="space-y-8">
                        <form onSubmit={handleCreateEvent} className="space-y-4 border-b border-slate-700 pb-8">
                            <h2 className="text-xl font-bold mb-4">{calendarData.id ? 'Edit Event' : 'Add Calendar Event'}</h2>
                            <div>
                                <label className="block text-sm mb-1">Title</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={calendarData.title} onChange={e => setCalendarData({ ...calendarData, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Start Date</label>
                                    <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={calendarData.start_date} onChange={e => setCalendarData({ ...calendarData, start_date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">End Date</label>
                                    <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={calendarData.end_date} onChange={e => setCalendarData({ ...calendarData, end_date: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Icon (Emoji)</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2" value={calendarData.icon} onChange={e => setCalendarData({ ...calendarData, icon: e.target.value })} />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="bg-purple-600 px-6 py-2 rounded hover:bg-purple-500">{calendarData.id ? 'Update Event' : 'Create Event'}</button>
                                {calendarData.id && (
                                    <button type="button" onClick={() => setCalendarData({ title: '', start_date: '', end_date: '', icon: '' })} className="bg-slate-600 px-6 py-2 rounded hover:bg-slate-500">Cancel</button>
                                )}
                            </div>
                        </form>

                        <div>
                            <h3 className="text-lg font-bold mb-4">Existing Events</h3>
                            <div className="space-y-4">
                                {eventsList.map(event => (
                                    <div key={event.id} className="bg-slate-900 p-4 rounded border border-slate-700 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{event.icon}</span>
                                            <div>
                                                <h4 className="font-bold">{event.title}</h4>
                                                <p className="text-sm text-slate-400">{event.start_date} - {event.end_date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setCalendarData(event)} className="text-blue-400 hover:text-blue-300">Edit</button>
                                            <button onClick={() => handleDeleteEvent(event.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'resume' && (
                    <form onSubmit={handleSaveResume} className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Edit Resume (JSON)</h2>
                        <div>
                            <label className="block text-sm mb-1">Content (JSON)</label>
                            <textarea className="w-full bg-slate-900 border border-slate-700 rounded p-2 h-96 font-mono text-xs" value={resumeData} onChange={e => setResumeData(e.target.value)} />
                        </div>
                        <button type="submit" className="bg-orange-600 px-6 py-2 rounded hover:bg-orange-500">Save Resume</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Admin;
