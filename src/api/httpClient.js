import axios from 'axios';
import env from '../config/env';

/**
 * HTTP Client
 * 
 * Centralized axios instance with:
 * - Base URL from env
 * - Auth token injection
 * - Error handling
 * - Request/response logging (dev only)
 */

const httpClient = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - Add auth token
httpClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (env.isDevelopment()) {
            console.log('[HTTP Request]', config.method.toUpperCase(), config.url);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
httpClient.interceptors.response.use(
    (response) => {
        if (env.isDevelopment()) {
            console.log('[HTTP Response]', response.status, response.config.url);
        }
        return response;
    },
    (error) => {
        if (env.isDevelopment()) {
            console.error('[HTTP Error]', error.response?.status, error.config?.url);
        }

        const status = error.response?.status;
        const message = (error.response?.data?.message || '').toLowerCase();

        // Stale / deleted session detection
        // 401 = token expired / invalid
        // 403 = token valid but user/tenant no longer exists
        // 404 with "not found" body = same scenario after a DB purge
        const isStaleSession =
            status === 401 ||
            status === 403 ||
            (status === 404 && (message.includes('tenant') || message.includes('user') || message.includes('account')));

        if (isStaleSession) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return; // stop propagation — don't show error in UI
        }

        return Promise.reject(error);
    }
);

export default httpClient;
