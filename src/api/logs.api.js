import httpClient from './httpClient';

/**
 * Logs API
 * 
 * Access structured execution traces.
 */
export const logsAPI = {
    /**
     * Get recent logs
     * @param {Object} params - { limit, since }
     */
    getLogs: async (params = {}) => {
        const response = await httpClient.get('/logs', { params });
        return response.data;
    },

    /**
     * Clear all logs
     */
    clearLogs: async () => {
        const response = await httpClient.delete('/logs');
        return response.data;
    }
};
