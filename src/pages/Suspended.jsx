/**
 * Suspended Page
 * 
 * Shown when account is SUSPENDED.
 * Professional, clear messaging.
 */
function Suspended() {
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
                                    <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                                        <span className="text-danger fs-4">⚠</span>
                                    </div>
                                </div>
 
                                <h5 className="fw-normal text-dark mb-3">Account Suspended</h5>

                                <p className="text-muted small mb-4">
                                    Your account has been suspended.<br />
                                    Please contact support for assistance.
                                </p>

                                {user?.companyName && (
                                    <div className="bg-light rounded p-3 mb-4">
                                        <p className="text-muted small mb-1">Company</p>
                                        <p className="text-dark mb-0">{user.companyName}</p>
                                    </div>
                                )}

                                <p className="text-muted small mb-4">
                                    Support: support@sellagent.ai
                                </p>

                                <button
                                    className="btn btn-outline-dark btn-sm"
                                    onClick={handleLogout}
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Suspended;
