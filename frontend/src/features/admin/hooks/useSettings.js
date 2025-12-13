import { useState, useCallback } from 'react';
import { getSettings, updateSettings as apiUpdateSettings } from '@/core/api/api';
import { useToast } from '@/core/context/ToastContext';

export const useSettings = () => {
    const [settings, setSettings] = useState({ calendar_start_year: 2020, calendar_end_year: 2030 });
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getSettings();
            if (data) setSettings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSettings = async (settingsData) => {
        setLoading(true);
        try {
            await apiUpdateSettings(settingsData);
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
