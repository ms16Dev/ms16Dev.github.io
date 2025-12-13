import { useState, useCallback } from 'react';
import { getEvents, createEvent as apiCreateEvent, updateEvent as apiUpdateEvent, deleteEvent as apiDeleteEvent } from '../../../api/api';
import { useToast } from '../../../context/ToastContext';

export const useCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { addToast } = useToast();

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getEvents();
            setEvents(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    }, []);

    const createEvent = async (eventData) => {
        setLoading(true);
        try {
            const response = await apiCreateEvent(eventData);
            setEvents(prev => [...prev, response]);
            addToast('Event created successfully!', 'success');
            fetchEvents();
            return true;
        } catch (err) {
            console.error(err);
            setError('Failed to create event');
            addToast('Failed to create event', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateEvent = async (id, eventData) => {
        setLoading(true);
        try {
            await apiUpdateEvent(id, eventData);
            addToast('Event updated successfully!', 'success');
            fetchEvents();
            return true;
        } catch (err) {
            console.error(err);
            setError('Failed to update event');
            addToast('Failed to update event', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteEvent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return false;

        setLoading(true);
        try {
            await apiDeleteEvent(id);
            setEvents(prev => prev.filter(e => e.id !== id));
            addToast('Event deleted successfully', 'success');
            return true;
        } catch (err) {
            console.error(err);
            setError('Failed to delete event');
            addToast('Failed to delete event', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        events,
        loading,
        error,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent
    };
};
