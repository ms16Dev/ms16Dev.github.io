import { useState } from 'react';
import { User, Folder, Calendar, FileText, Settings } from 'lucide-react';

import AdminAbout from '../features/showcasing/components/AdminAbout';
import AdminProjects from '../features/projects/components/AdminProjects';
import AdminCalendar from '../features/calendar/components/AdminCalendar';
import AdminResume from '../features/resume/components/AdminResume';
import AdminSettings from '../features/admin/components/AdminSettings';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('about');

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

                    {activeTab === 'about' && <AdminAbout />}
                    {activeTab === 'projects' && <AdminProjects />}
                    {activeTab === 'calendar' && <AdminCalendar />}
                    {activeTab === 'resume' && <AdminResume />}
                    {activeTab === 'settings' && <AdminSettings />}

                </div>
            </div>
        </div>
    );
};

export default Admin;
