import httpClient from './httpClient';

/**
 * Dashboard API
 * 
 * Read-only dashboard metrics.
 */

export const dashboardAPI = {
    /**
     * Get dashboard summary
     */
    getSummary: async () => {
        const response = await httpClient.get('/dashboard/summary');
        return response.data;
    },

    /**
     * Get execution status
     */
    getExecutionStatus: async () => {
        const response = await httpClient.get('/dashboard/execution-status');
        return response.data;
    },

    /**
     * Get usage stats
     */
    getUsageStats: async () => {
        const response = await httpClient.get('/dashboard/usage');
        return response.data;
    }
};
