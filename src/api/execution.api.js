import httpClient from './httpClient';

/**
 * Execution API
 * 
 * Controls the running state of the sales agent.
 */
export const executionAPI = {
    /**
     * Get current engine status and controls
     */
    getStatus: async () => {
        const response = await httpClient.get('/engine/operational-status');
        return response.data;
    },

    /**
     * Get operational status
     */
    getOperationalStatus: async () => {
        const response = await httpClient.get('/engine/operational-status');
        return response.data;
    },

    /**
     * Pause agent execution
     */
    pause: async () => {
        const response = await httpClient.post('/engine/pause');
        return response.data;
    },

    /**
     * Resume agent execution
     */
    resume: async () => {
        const response = await httpClient.post('/engine/resume');
        return response.data;
    },

    /**
     * Inject a test lead (Harness)
     */
    injectLead: async () => {
        const response = await httpClient.post('/engine/inject-lead');
        return response.data;
    },

    /**
     * Inject a mock reply (Harness)
     */
    injectReply: async (leadId, message) => {
        const response = await httpClient.post('/engine/inject-reply', { leadId, message });
        return response.data;
    }
};
