import httpClient from './httpClient';

/**
 * Email Configuration API
 * 
 * Handles Gmail OAuth and email mode configuration.
 */

export const emailConfigAPI = {
    /**
     * Get Gmail OAuth URL
     */
    getGmailAuthUrl: async (productId) => {
        const response = await httpClient.get(`/oauth/gmail/auth-url?productId=${productId}`);
        return response.data;
    },

    /**
     * Get Gmail connection status
     */
    getGmailStatus: async (productId) => {
        const response = await httpClient.get(`/oauth/gmail/status/${productId}`);
        return response.data;
    },

    /**
     * Disconnect Gmail
     */
    disconnectGmail: async (productId) => {
        const response = await httpClient.post(`/oauth/gmail/disconnect/${productId}`);
        return response.data;
    },

    /**
     * Send test email
     */
    sendTestEmail: async (productId) => {
        const response = await httpClient.post(`/oauth/gmail/test/${productId}`);
        return response.data;
    }
};
