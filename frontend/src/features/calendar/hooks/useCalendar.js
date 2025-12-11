import { useState, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../../../context/ToastContext';

const API_URL = 'http://localhost:8000/calendar/';

export const useCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            setEvents(response.data);
        } catch (err) {
            console.error(err);
            // addToast('Failed to fetch events', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    const createEvent = async (eventData) => {
        setLoading(true);
        try {
            await axios.post(API_URL, eventData);
            addToast('Event created successfully!', 'success');
            fetchEvents();
            return true;
        } catch (err) {
            console.error(err);
            addToast('Failed to create event', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateEvent = async (id, eventData) => {
        setLoading(true);
        try {
            await axios.put(`${API_URL}${id}`, eventData);
            addToast('Event updated successfully!', 'success');
            fetchEvents();
            return true;
        } catch (err) {
            console.error(err);
            addToast('Failed to update event', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteEvent = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${API_URL}${id}`);
            setEvents(prev => prev.filter(e => e.id !== id));
            addToast('Event deleted successfully', 'success');
            return true;
        } catch (err) {
            console.error(err);
            addToast('Failed to delete event', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        events,
        loading,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent
    };
};
