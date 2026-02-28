import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * 
 * Enforces authentication.
 * Redirects to login if not authenticated.
 */
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('auth_token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
