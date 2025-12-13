import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar';

const AdminCalendar = () => {
    const { events, fetchEvents, createEvent, updateEvent, deleteEvent } = useCalendar();
    const [calendarData, setCalendarData] = useState({ title: '', start_date: '', end_date: '', icon: '' });

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let success;
        if (calendarData.id) {
            success = await updateEvent(calendarData.id, calendarData);
        } else {
            success = await createEvent(calendarData);
        }
        if (success) {
            setCalendarData({ title: '', start_date: '', end_date: '', icon: '' });
        }
    };

    const handleEdit = (event) => {
        setCalendarData(event);
    };

    const inputClass = "w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm";
    const labelClass = "block text-sm font-medium mb-2 text-accent";

    return (
        <div className="space-y-8 animate-fadeIn">
            <form onSubmit={handleSubmit} className="space-y-6 border-b border-white/20 pb-8">
                <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                    <Calendar size={32} /> {calendarData.id ? 'Edit Event' : 'Add Calendar Event'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className={labelClass}>Title</label>
                        <input type="text" className={inputClass} value={calendarData.title} onChange={e => setCalendarData({ ...calendarData, title: e.target.value })} required />
                    </div>
                    <div>
                        <label className={labelClass}>Start Date</label>
                        <input type="date" className={inputClass} value={calendarData.start_date} onChange={e => setCalendarData({ ...calendarData, start_date: e.target.value })} required />
                    </div>
                    <div>
                        <label className={labelClass}>End Date</label>
                        <input type="date" className={inputClass} value={calendarData.end_date} onChange={e => setCalendarData({ ...calendarData, end_date: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelClass}>Icon (Emoji)</label>
                        <input type="text" className={inputClass} value={calendarData.icon} onChange={e => setCalendarData({ ...calendarData, icon: e.target.value })} />
                    </div>
                </div>
                <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-accent/25 hover:scale-105 transition-all">
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
                    {events.map(event => (
                        <div key={event.id} className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl border border-white/20 dark:border-slate-700 flex justify-between items-center hover:bg-white/50 dark:hover:bg-slate-800/60 transition-colors">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl bg-white/50 dark:bg-slate-700/50 p-2 rounded-lg">{event.icon}</span>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{event.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{event.start_date} - {event.end_date}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handleEdit(event)} className="text-accent hover:text-accent/80 font-medium">Edit</button>
                                <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminCalendar;
