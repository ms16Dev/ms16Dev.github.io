import { useState, useEffect } from 'react';
import { getEvents, getSettings } from '../../../core/api/api';

export const useCalendarData = () => {
    const [events, setEvents] = useState([]);
    const [settings, setSettings] = useState({ calendar_start_year: 2020, calendar_end_year: 2030 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsData, settingsData] = await Promise.all([
                    getEvents(),
                    getSettings()
                ]);

                setEvents(eventsData);
                if (settingsData) {
                    setSettings(settingsData);
                }
            } catch (err) {
                console.error("Failed to fetch calendar data", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { events, settings, loading, error };
};
