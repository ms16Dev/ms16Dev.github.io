import { useRef, useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const AdminSettings = () => {
    const { settings, fetchSettings, updateSettings } = useSettings();
    const [localSettings, setLocalSettings] = useState({ calendar_start_year: 2020, calendar_end_year: 2030 });
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchSettings();
            hasFetched.current = true;
        }
    }, [fetchSettings]);

    useEffect(() => {
        if (settings) {
            setLocalSettings(settings);
        }
    }, [settings]);

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        await updateSettings(localSettings);
    };

    const inputClass = "w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm";
    const labelClass = "block text-sm font-medium mb-2 text-accent";

    return (
        <form onSubmit={handleSaveSettings} className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                <Settings size={32} /> Calendar Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Start Year</label>
                    <input
                        type="number"
                        className={inputClass}
                        value={localSettings.calendar_start_year}
                        onChange={e => setLocalSettings({ ...localSettings, calendar_start_year: parseInt(e.target.value) })}
                    />
                </div>
                <div>
                    <label className={labelClass}>End Year</label>
                    <input
                        type="number"
                        className={inputClass}
                        value={localSettings.calendar_end_year}
                        onChange={e => setLocalSettings({ ...localSettings, calendar_end_year: parseInt(e.target.value) })}
                    />
                </div>
            </div>
            <button type="submit" className="w-full md:w-auto bg-secondary dark:bg-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-accent/25 hover:scale-105 transition-all">
                Save Settings
            </button>
        </form>
    );
};

export default AdminSettings;
