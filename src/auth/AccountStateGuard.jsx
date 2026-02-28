import { Navigate } from 'react-router-dom';

/**
 * AccountStateGuard Component
 * 
 * Enforces account state requirements.
 * Only ACTIVE accounts can access protected content.
 * 
 * Account States:
 * - PENDING_VERIFICATION: Waiting for GST verification
 * - ACTIVE: Full access
 * - PAUSED: Limited access (read-only)
 * - SUSPENDED: No access
 */

const ACCOUNT_STATES = {
    PENDING_VERIFICATION: 'PENDING_VERIFICATION',
    ACTIVE: 'ACTIVE',
    PAUSED: 'PAUSED',
    SUSPENDED: 'SUSPENDED'
};

function AccountStateGuard({ children, allowedStates = ['ACTIVE'] }) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const accountState = user.accountState || 'PENDING_VERIFICATION';

    // Check if account state is allowed
    if (!allowedStates.includes(accountState)) {
        // Redirect to appropriate page based on state
        if (accountState === 'PENDING_VERIFICATION') {
            return <Navigate to="/pending-verification" replace />;
        }
        if (accountState === 'SUSPENDED') {
            return <Navigate to="/suspended" replace />;
        }
        // PAUSED state might still allow read-only access
        if (accountState === 'PAUSED' && !allowedStates.includes('PAUSED')) {
            return <Navigate to="/account-paused" replace />;
        }
    }

    return children;
}

export { ACCOUNT_STATES };
export default AccountStateGuard;
