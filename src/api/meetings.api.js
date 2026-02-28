import httpClient from './httpClient';

export const meetingsAPI = {
    getAll: async () => {
        const response = await httpClient.get('/meetings');
        return response.data;
    },
    getToday: async () => {
        const response = await httpClient.get('/meetings/today');
        return response.data;
    },
    getStatus: async () => {
        const response = await httpClient.get('/meetings/status');
        return response.data;
    },
    getCalendarEmbedUrl: async () => {
        const response = await httpClient.get('/calendar/embed');
        return response.data;
    }
};
