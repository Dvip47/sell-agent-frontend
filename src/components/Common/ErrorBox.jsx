/**
 * ErrorBox Component
 * 
 * Displays error messages.
 * Calm, professional tone.
 */
function ErrorBox({ error, onRetry }) {
    if (!error) return null;

    const errorMessage = typeof error === 'string'
        ? error
        : error.message || 'An unexpected error occurred';

    return (
        <div className="alert alert-danger" role="alert">
            <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                    <h6 className="alert-heading mb-1">Error</h6>
                    <p className="mb-0 small">{errorMessage}</p>
                </div>
                {onRetry && (
                    <button
                        className="btn btn-sm btn-outline-danger ms-3"
                        onClick={onRetry}
                    >
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
}

export default ErrorBox;
