/**
 * EmptyState Component
 * 
 * Displayed when no data is available.
 * Professional, explanatory tone.
 */
function EmptyState({ title, message, icon = '📋' }) {
    return (
        <div className="text-center py-5">
            <div className="mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}>
                {icon}
            </div>
            <h5 className="text-muted fw-normal">{title}</h5>
            {message && <p className="text-muted small">{message}</p>}
        </div>
    );
}

export default EmptyState;
