/**
 * Environment Configuration
 * 
 * Centralized environment variable management.
 * No hardcoded URLs anywhere in the application.
 */

const env = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'SellAgent',

    isDevelopment: () => env.APP_ENV === 'development',
    isProduction: () => env.APP_ENV === 'production',
};

export default env;
