import { Link, useNavigate } from 'react-router-dom';
import AccountStateBadge from '../Common/AccountStateBadge';

/**
 * Header Component
 * 
 * Top navigation bar with account state display.
 * Shows: user email, account state, logout
 */
function Header() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
            <div className="container-fluid">
                <Link className="navbar-brand fw-normal" to="/dashboard">
                    SellAgent
                </Link>

                <div className="d-flex align-items-center">
                    {/* Account State Badge */}
                    {user?.accountState && (
                        <div className="me-3">
                            <AccountStateBadge state={user.accountState} />
                        </div>
                    )}

                    {/* User Info */}
                    <div className="text-light small me-3 text-end">
                        {user?.companyName && <div className="fw-bold opacity-75">{user.companyName}</div>}
                        <div className="opacity-50" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
                    </div>

                    {/* Role Badge */}
                    {user?.role && (
                        <span className="badge bg-secondary me-3">
                            {user.role}
                        </span>
                    )}

                    {/* Logout */}
                    <button
                        className="btn btn-sm btn-outline-light"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Header;
