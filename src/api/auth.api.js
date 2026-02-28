import httpClient from './httpClient';

/**
 * Authentication API
 * 
 * All auth-related endpoints.
 */

export const authAPI = {
    /**
     * Login
     * @param {Object} credentials - { email, password }
     */
    login: async (credentials) => {
        const response = await httpClient.post('/auth/login', credentials);
        return response.data;
    },

    /**
     * Register
     * @param {Object} data - { email, password, companyName, gstNumber }
     */
    register: async (data) => {
        const response = await httpClient.post('/auth/register', data);
        return response.data;
    },

    /**
     * Get current user
     */
    getCurrentUser: async () => {
        const response = await httpClient.get('/auth/me');
        return response.data;
    },

    /**
     * Forgot password
     * @param {Object} data - { email }
     */
    forgotPassword: async (data) => {
        const response = await httpClient.post('/auth/forgot-password', data);
        return response.data;
    },

    /**
     * Reset password
     * @param {Object} data - { token, password }
     */
    resetPassword: async (data) => {
        const response = await httpClient.post('/auth/reset-password', data);
        return response.data;
    }
};
