import { useState, useEffect } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import Loader from '../components/Common/Loader';
import ErrorBox from '../components/Common/ErrorBox';
import { adminAPI } from '../api/admin.api';
import { formatNumber } from '../utils/formatters';

/**
 * AdminDashboard Component
 * 
 * Accessible only to SUPER_ADMIN.
 * View all clients, system-wide status.
 */
function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminAPI.getSystemStats();
            setStats(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load system stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <AppLayout><Loader text="Loading system stats..." /></AppLayout>;
    if (error) return <AppLayout><ErrorBox error={error} onRetry={loadStats} /></AppLayout>;

    return (
        <AppLayout>
            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col">
                        <h4 className="fw-normal text-dark">Admin Mission Control</h4>
                        <p className="text-muted small mb-0">System-wide performance and client status</p>
                    </div>
                </div>

                {/* System Overview */}
                <div className="row g-3">
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h6 className="text-muted text-uppercase small mb-2">Total Clients</h6>
                                <h3 className="fw-normal mb-0">{formatNumber(stats?.totalClients || 0)}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h6 className="text-muted text-uppercase small mb-2">Pending Verification</h6>
                                <h3 className="fw-normal mb-0 text-warning">{formatNumber(stats?.pendingClients || 0)}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h6 className="text-muted text-uppercase small mb-2">Total Meetings (MTD)</h6>
                                <h3 className="fw-normal mb-0">{formatNumber(stats?.totalMeetingsMTD || 0)}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h6 className="text-muted text-uppercase small mb-2">Active Agents</h6>
                                <h3 className="fw-normal mb-0 text-success">{formatNumber(stats?.activeAgents || 0)}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity or Quick Actions */}
                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h6 className="text-muted text-uppercase small mb-3">System Health</h6>
                                <div className="d-flex gap-4">
                                    <div>
                                        <p className="text-muted small mb-1">Database</p>
                                        <span className="badge bg-success">Operational</span>
                                    </div>
                                    <div>
                                        <p className="text-muted small mb-1">Agent Loop</p>
                                        <span className="badge bg-success">Operational</span>
                                    </div>
                                    <div>
                                        <p className="text-muted small mb-1">Email Service</p>
                                        <span className="badge bg-success">Operational</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default AdminDashboard;
