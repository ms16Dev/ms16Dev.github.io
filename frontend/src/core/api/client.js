import axios from 'axios';

// Create axios instance with base configuration
const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9000/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach auth token if available
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
client.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } else if (error.response.status >= 500) {
                // Server error - optionally redirect to error page
                // Comment this out if you want to handle 500 errors in components
                console.error('Server error:', error.response.status);
                // window.location.href = '/error';
            }
        } else if (error.request) {
            // The request was made but no response was received (network error)
            console.error('No response received (network error):', error.request);
            // Could show a toast or redirect to error page
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default client;
