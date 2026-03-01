/**
 * Environment Configuration
 * 
 * Centralized environment variable management.
 * No hardcoded URLs anywhere in the application.
 */

const env = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://sellagent-backend.onrender.com',
    APP_ENV: import.meta.env.VITE_APP_ENV || 'production',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'SellAgent',

    isDevelopment: () => env.APP_ENV !== 'production',
    isProduction: () => env.APP_ENV === 'production',
};

export default env;
