import { Navigate } from 'react-router-dom';
import { ROLES } from '../utils/constants';

/**
 * RoleGuard Component
 * 
 * Enforces role-based access control.
 * Checks user role from localStorage against allowed roles.
 * 
 * Usage:
 * <RoleGuard roles={['ADMIN', 'SUPER_ADMIN']}>
 *   <ProtectedContent />
 * </RoleGuard>
 */
function RoleGuard({ children, roles = [] }) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user's role is in allowed roles
    if (roles.length > 0 && !roles.includes(user.role)) {
        // Redirect based on role
        if (user.role === 'SUPER_ADMIN') {
            return <Navigate to="/super-admin" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default RoleGuard;
