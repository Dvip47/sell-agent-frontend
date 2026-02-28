/**
 * Loader Component
 * 
 * Simple Bootstrap spinner.
 * No custom animations.
 */
function Loader({ text = 'Loading...' }) {
    return (
        <div className="text-center py-5">
            <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            {text && <p className="text-muted mt-2 small">{text}</p>}
        </div>
    );
}

export default Loader;
