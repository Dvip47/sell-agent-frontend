/**
 * Pending Verification Page
 * 
 * Shown when account is PENDING_VERIFICATION.
 * Professional, explanatory tone.
 */
function PendingVerification() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4 text-center">
                                <div className="mb-4">
                                    <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                                        <span className="text-warning fs-4">⏳</span>
                                    </div>
                                </div>

                                <h5 className="fw-normal text-dark mb-3">Verification In Progress</h5>

                                <p className="text-muted small mb-4">
                                    Your account is currently under verification.<br />
                                    This process may take up to 24 hours.
                                </p>

                                {user?.companyName && (
                                    <div className="bg-light rounded p-3 mb-4">
                                        <p className="text-muted small mb-1">Company</p>
                                        <p className="text-dark mb-0">{user.companyName}</p>
                                    </div>
                                )}

                                <p className="text-muted small mb-4">
                                    We will notify you at <strong>{user?.email}</strong> once your account is activated.
                                </p>

                                <button
                                    className="btn btn-outline-dark btn-sm"
                                    onClick={handleLogout}
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        <div className="text-center mt-3">
                            <p className="text-muted small">
                                Questions? Contact support@sellagent.ai
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PendingVerification;
