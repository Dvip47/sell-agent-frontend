import httpClient from './httpClient';

/**
 * Persona API
 */
export const personaAPI = {
    get: async () => {
        const response = await httpClient.get('/persona');
        return response.data;
    },
    save: async (data) => {
        const response = await httpClient.post('/persona', data);
        return response.data;
    }
};
