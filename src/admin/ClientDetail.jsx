import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import Loader from '../components/Common/Loader';
import ErrorBox from '../components/Common/ErrorBox';
import StatusBadge from '../components/Common/StatusBadge';
import { adminAPI } from '../api/admin.api';
import { formatDate, formatNumber } from '../utils/formatters';

function ClientDetail() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [client, setClient] = useState(null);

    useEffect(() => {
        loadClient();
    }, [clientId]);

    const loadClient = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminAPI.getClient(clientId);
            setClient(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load client details');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!window.confirm('Verify this client and activate their account?')) return;
        setActionLoading(true);
        try {
            await adminAPI.verifyClient(clientId);
            await loadClient();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to verify client');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSuspend = async () => {
        if (!window.confirm('SUSPEND this client? This will stop all operations.')) return;
        setActionLoading(true);
        try {
            await adminAPI.suspendClient(clientId);
            await loadClient();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to suspend client');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <AppLayout><Loader text="Loading client details..." /></AppLayout>;
    if (error) return <AppLayout><ErrorBox error={error} onRetry={loadClient} /></AppLayout>;

    return (
        <AppLayout>
            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col d-flex align-items-center">
                        <button className="btn btn-sm btn-link text-dark ps-0 me-3" onClick={() => navigate('/admin/clients')}>
                            ← Back
                        </button>
                        <div>
                            <h4 className="fw-normal text-dark mb-0">{client.companyName}</h4>
                            <p className="text-muted small mb-0">Client Identifier: {client._id}</p>
                        </div>
                    </div>
                    <div className="col-auto">
                        <StatusBadge state={client.accountState} size="lg" />
                    </div>
                </div>

                <div className="row g-4">
                    {/* GST & Registration Data */}
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <h6 className="text-muted text-uppercase small mb-4">Business Verification Data</h6>
                                <div className="mb-4">
                                    <label className="text-muted small d-block">GST Number</label>
                                    <p className="fw-medium fs-5 mb-0">{client.gstNumber}</p>
                                    <span className="badge bg-light text-dark border">Official Record</span>
                                </div>
                                <div className="mb-4">
                                    <label className="text-muted small d-block">Registered Email</label>
                                    <p className="fw-medium mb-0">{client.email}</p>
                                </div>
                                <div className="mb-0">
                                    <label className="text-muted small d-block">Registration Date</label>
                                    <p className="fw-medium mb-0">{formatDate(client.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Status */}
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100 text-end">
                            <div className="card-body d-flex flex-column justify-content-between">
                                <h6 className="text-muted text-uppercase small mb-4">Account Controls</h6>

                                <div className="d-grid gap-2">
                                    {client.accountState === 'PENDING_VERIFICATION' && (
                                        <button
                                            className="btn btn-success"
                                            onClick={handleVerify}
                                            disabled={actionLoading}
                                        >
                                            Verify & Activate Account
                                        </button>
                                    )}

                                    {client.accountState !== 'SUSPENDED' && (
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={handleSuspend}
                                            disabled={actionLoading}
                                        >
                                            Suspend Account
                                        </button>
                                    )}

                                    {client.accountState === 'SUSPENDED' && (
                                        <button
                                            className="btn btn-outline-success"
                                            onClick={handleVerify}
                                            disabled={actionLoading}
                                        >
                                            Re-Activate Account
                                        </button>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-top">
                                    <p className="text-muted small mb-2 text-start">Current Execution State</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <StatusBadge state={client.executionStatus || 'PAUSED'} />
                                        <span className="text-muted small">Daily Limit: {formatNumber(client.dailyLimit || 50)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Snapshot */}
                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h6 className="text-muted text-uppercase small mb-3">Enterprise Snapshot</h6>
                                <div className="row text-center">
                                    <div className="col">
                                        <p className="text-muted small mb-1">Meetings Booked</p>
                                        <h4 className="fw-normal">{formatNumber(client.stats?.meetingsBooked || 0)}</h4>
                                    </div>
                                    <div className="col border-start">
                                        <p className="text-muted small mb-1">Emails Sent</p>
                                        <h4 className="fw-normal">{formatNumber(client.stats?.emailsSent || 0)}</h4>
                                    </div>
                                    <div className="col border-start">
                                        <p className="text-muted small mb-1">Credits Remaining</p>
                                        <h4 className="fw-normal">{formatNumber(client.credits || 0)}</h4>
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

export default ClientDetail;
