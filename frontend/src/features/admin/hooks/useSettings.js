import { useState, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../../../context/ToastContext';

const SETTINGS_URL = 'http://localhost:8000/settings/';

export const useSettings = () => {
    const [settings, setSettings] = useState({ calendar_start_year: 2020, calendar_end_year: 2030 });
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(SETTINGS_URL);
            if (response.data) setSettings(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSettings = async (settingsData) => {
        setLoading(true);
        try {
            await axios.put(SETTINGS_URL, settingsData);
            addToast('Settings updated!', 'success');
            fetchSettings();
            return true;
        } catch (err) {
            console.error(err);
            addToast('Failed to update settings', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        settings,
        loading,
        fetchSettings,
        updateSettings
    };
};
