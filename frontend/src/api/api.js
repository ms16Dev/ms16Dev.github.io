import client from './client';

// ============================================
// AUTH API
// ============================================
export const login = async (credentials) => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await client.post('/auth/token', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// ============================================
// PROJECTS API
// ============================================
export const getProjects = async () => {
    const response = await client.get('/projects/');
    return response.data;
};

export const createProject = async (formData) => {
    const response = await client.post('/projects/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateProject = async (id, formData) => {
    const response = await client.put(`/projects/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteProject = async (id) => {
    const response = await client.delete(`/projects/${id}`);
    return response.data;
};

// ============================================
// TECHNOLOGIES API
// ============================================
export const getTechnologies = async () => {
    const response = await client.get('/technologies/');
    return response.data;
};

export const createTechnology = async (formData) => {
    const response = await client.post('/technologies/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteTechnology = async (id) => {
    const response = await client.delete(`/technologies/${id}`);
    return response.data;
};

// ============================================
// CALENDAR API
// ============================================
export const getEvents = async () => {
    const response = await client.get('/calendar/');
    return response.data;
};

export const createEvent = async (eventData) => {
    const response = await client.post('/calendar/', eventData);
    return response.data;
};

export const updateEvent = async (id, eventData) => {
    const response = await client.put(`/calendar/${id}`, eventData);
    return response.data;
};

export const deleteEvent = async (id) => {
    const response = await client.delete(`/calendar/${id}`);
    return response.data;
};

// ============================================
// ABOUT API
// ============================================
export const getAbout = async () => {
    const response = await client.get('/about/');
    return response.data;
};

export const updateAbout = async (formData) => {
    const response = await client.post('/about/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const getAboutTechnologies = async () => {
    const response = await client.get('/about/technologies');
    return response.data;
};

export const addAboutTechnology = async (formData) => {
    const response = await client.post('/about/technologies', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteAboutTechnology = async (id) => {
    const response = await client.delete(`/about/technologies/${id}`);
    return response.data;
};

// ============================================
// RESUME API
// ============================================
export const getResume = async () => {
    const response = await client.get('/resume/');
    return response.data;
};

export const uploadResume = async (resumeData) => {
    const response = await client.post('/resume/', resumeData);
    return response.data;
};

// ============================================
// SETTINGS API
// ============================================
export const getSettings = async () => {
    const response = await client.get('/settings/');
    return response.data;
};

export const updateSettings = async (settingsData) => {
    const response = await client.put('/settings/', settingsData);
    return response.data;
};
