import httpClient from './httpClient';

/**
 * Leads API
 * 
 * Read-only lead management.
 */

export const leadsAPI = {
    /**
     * Get all leads with pagination
     * @param {Object} params - { page, limit, state, search }
     */
    getLeads: async (params = {}) => {
        const response = await httpClient.get('/leads', { params });
        return response.data;
    },

    /**
     * Get single lead by ID
     * @param {string} leadId
     */
    getLead: async (leadId) => {
        const response = await httpClient.get(`/leads/${leadId}`);
        return response.data;
    },

    /**
     * Get lead timeline
     * @param {string} leadId
     */
    getLeadTimeline: async (leadId) => {
        const response = await httpClient.get(`/leads/${leadId}/timeline`);
        return response.data;
    },

    /**
     * Get recommended calls
     */
    getRecommendedCalls: async () => {
        const response = await httpClient.get('/leads/recommended-calls');
        return response.data;
    },

    /**
     * Mark lead as called
     * @param {string} leadId 
     * @param {Object} data - { callOutcome, callNotes, callNextFollowUpDate }
     */
    markCalled: async (leadId, data) => {
        const response = await httpClient.post(`/leads/${leadId}/mark-called`, data);
        return response.data;
    },

    /**
     * Bulk delete leads
     * @param {string[]} ids 
     */
    bulkDelete: async (ids) => {
        const response = await httpClient.post('/leads/mass-delete', { ids });
        return response.data;
    },

    /**
     * Bulk block leads
     * @param {string[]} ids 
     */
    bulkBlock: async (ids) => {
        const response = await httpClient.post('/leads/mass-block', { ids });
        return response.data;
    },

    deleteErrors: async () => {
        const response = await httpClient.post('/leads/delete-errors');
        return response.data;
    }
};
