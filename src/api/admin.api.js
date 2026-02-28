import httpClient from './httpClient';

/**
 * Admin API
 * 
 * Accessible only to SUPER_ADMIN role.
 */

export const adminAPI = {
    /**
     * Get all clients
     * @param {Object} params - { page, limit, state, search }
     */
    getClients: async (params = {}) => {
        const response = await httpClient.get('/admin/clients', { params });
        return response.data;
    },

    /**
     * Get single client detail
     * @param {string} clientId
     */
    getClient: async (clientId) => {
        const response = await httpClient.get(`/admin/clients/${clientId}`);
        return response.data;
    },

    /**
     * Verify client (Activate account)
     * @param {string} clientId
     */
    verifyClient: async (clientId) => {
        const response = await httpClient.post(`/admin/clients/${clientId}/verify`);
        return response.data;
    },

    /**
     * Suspend client
     * @param {string} clientId
     */
    suspendClient: async (clientId) => {
        const response = await httpClient.post(`/admin/clients/${clientId}/suspend`);
        return response.data;
    },

    /**
     * Pause client execution
     * @param {string} clientId
     */
    pauseClient: async (clientId) => {
        const response = await httpClient.post(`/admin/clients/${clientId}/pause`);
        return response.data;
    },

    /**
     * Resume client execution
     * @param {string} clientId
     */
    resumeClient: async (clientId) => {
        const response = await httpClient.post(`/admin/clients/${clientId}/resume`);
        return response.data;
    },

    /**
     * Get system-wide stats
     */
    getSystemStats: async () => {
        const response = await httpClient.get('/admin/stats');
        return response.data;
    }
};
