import httpClient from './httpClient';

export const productAPI = {
    getSetup: async (id) => {
        const url = id ? `/product/${id}` : '/product';
        const response = await httpClient.get(url);
        return response.data;
    },
    saveSetup: async (data) => {
        const response = await httpClient.post('/product', data);
        return response.data;
    },
    activate: async (productId) => {
        const response = await httpClient.post(`/product/${productId}/activate`);
        return response.data;
    },
    compile: async (productId) => {
        const response = await httpClient.post(`/product/${productId}/compile`);
        return response.data;
    },
    delete: async (productId) => {
        const response = await httpClient.delete(`/product/${productId}`);
        return response.data;
    }
};
