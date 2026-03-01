import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://sellagent-backend.onrender.com';

/**
 * Email Template API
 * Handles product-specific banner uploads and configurations.
 */
export const emailTemplateAPI = {
    /**
     * Get current email template configuration for a product
     */
    getConfig: async (productId) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`${API_URL}/email-template/${productId}/config`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    /**
     * Update template configuration for a product
     */
    updateConfig: async (productId, payload) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.patch(`${API_URL}/email-template/${productId}/config`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    /**
     * Upload banner image for a product
     */
    uploadBanner: async (productId, file) => {
        const token = localStorage.getItem('auth_token');
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/email-template/${productId}/banner`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Remove banner for a product
     */
    removeBanner: async (productId) => {
        const token = localStorage.getItem('auth_token');
        const response = await axios.delete(`${API_URL}/email-template/${productId}/banner`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};
