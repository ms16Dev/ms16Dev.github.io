import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCalendarData = () => {
    const [events, setEvents] = useState([]);
    const [settings, setSettings] = useState({ calendar_start_year: 2020, calendar_end_year: 2030 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsRes, settingsRes] = await Promise.all([
                    axios.get('http://localhost:8000/calendar/'),
                    axios.get('http://localhost:8000/settings/')
                ]);

                setEvents(eventsRes.data);
                if (settingsRes.data) {
                    setSettings(settingsRes.data);
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
