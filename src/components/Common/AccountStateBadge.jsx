/**
 * AccountStateBadge Component
 * 
 * Displays account state with appropriate color.
 * Must be visible: Header, Dashboard, Settings
 */

const STATE_CONFIG = {
    PENDING_VERIFICATION: {
        color: 'warning',
        label: 'Pending Verification',
        description: 'Your account is being verified'
    },
    ACTIVE: {
        color: 'success',
        label: 'Active',
        description: 'Account is active'
    },
    PAUSED: {
        color: 'secondary',
        label: 'Paused',
        description: 'Execution is paused'
    },
    SUSPENDED: {
        color: 'danger',
        label: 'Suspended',
        description: 'Account has been suspended'
    }
};

function AccountStateBadge({ state, showDescription = false }) {
    const config = STATE_CONFIG[state] || STATE_CONFIG.PENDING_VERIFICATION;

    return (
        <div className="d-inline-flex align-items-center">
            <span className={`badge bg-${config.color}`}>
                {config.label}
            </span>
            {showDescription && (
                <span className="text-muted small ms-2">
                    {config.description}
                </span>
            )}
        </div>
    );
}

export default AccountStateBadge;
