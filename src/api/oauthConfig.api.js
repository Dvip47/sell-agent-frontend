import httpClient from './httpClient';

/**
 * OAuth Configuration API
 * Allows saving per-tenant Google OAuth credentials through the UI.
 */
export const oauthConfigAPI = {
    /**
     * Get current OAuth config status
     */
    getCredentials: async () => {
        const response = await httpClient.get('/oauth-config/credentials');
        return response.data;
    },

    /**
     * Save Google OAuth Client ID + Secret
     */
    saveCredentials: async (clientId, clientSecret) => {
        const response = await httpClient.post('/oauth-config/credentials', { clientId, clientSecret });
        return response.data;
    },

    /**
     * Remove custom credentials (revert to system default)
     */
    removeCredentials: async () => {
        const response = await httpClient.delete('/oauth-config/credentials');
        return response.data;
    }
};
