import { Link, useLocation } from 'react-router-dom';

/**
 * Sidebar Component
 * 
 * Left navigation menu.
 * Role-based visibility.
 */
function Sidebar() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    // Super Admin sees different menu
    if (isSuperAdmin) {
        return (
            <div className="bg-light border-end" style={{ width: '250px', minHeight: '100vh' }}>
                <div className="p-3">
                    <h6 className="text-muted text-uppercase small mb-3">Admin Panel</h6>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link className={`nav-link text-dark ${isActive('/admin')}`} to="/admin">
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link text-dark ${isActive('/admin/clients')}`} to="/admin/clients">
                                Clients
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    // Regular client menu
    return (
        <div className="bg-light border-end" style={{ width: '250px', minHeight: '100vh' }}>
            <div className="p-3">
                <h6 className="text-muted text-uppercase small mb-3">Menu</h6>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link className={`nav-link text-dark ${isActive('/dashboard')}`} to="/dashboard">
                            Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link text-dark ${isActive('/leads')}`} to="/leads">
                            Leads
                        </Link>
                    </li>
                    {/* <li className="nav-item">
                        <Link className={`nav-link text-dark ${isActive('/meetings')}`} to="/meetings">
                            Meetings
                        </Link>
                    </li> */}
                    <li className="nav-item">
                        <Link className={`nav-link text-dark ${isActive('/setup')}`} to="/setup">
                            Product Setup
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link text-dark ${isActive('/settings')}`} to="/settings">
                            Control Center
                        </Link>
                    </li>
                    {/* <li className="nav-item border-top mt-2 pt-2">
                        <Link className={`nav-link text-info small ${isActive('/test-harness')}`} to="/test-harness">
                            <i className="bi bi-bug me-2"></i>
                            Test Harness
                        </Link>
                    </li> */}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
