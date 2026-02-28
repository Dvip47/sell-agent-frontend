import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import Loader from '../components/Common/Loader';
import ErrorBox from '../components/Common/ErrorBox';
import StatusBadge from '../components/Common/StatusBadge';
import { adminAPI } from '../api/admin.api';
import { formatDate } from '../utils/formatters';

function ClientList() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clients, setClients] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadClients();
    }, [page]);

    const loadClients = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminAPI.getClients({ page, limit: 10 });
            setClients(data.clients);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load client list');
        } finally {
            setLoading(false);
        }
    };

    if (loading && page === 1) return <AppLayout><Loader text="Loading clients..." /></AppLayout>;
    if (error) return <AppLayout><ErrorBox error={error} onRetry={loadClients} /></AppLayout>;

    return (
        <AppLayout>
            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col">
                        <h4 className="fw-normal text-dark">Client Management</h4>
                        <p className="text-muted small mb-0">Manage all registered businesses and their states</p>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3">Company</th>
                                        <th className="px-4 py-3">GST Number</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Created</th>
                                        <th className="px-4 py-3 text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">
                                                No clients found
                                            </td>
                                        </tr>
                                    ) : (
                                        clients.map((client) => (
                                            <tr key={client._id}>
                                                <td className="px-4 py-3 fw-medium">{client.companyName}</td>
                                                <td className="px-4 py-3 small">{client.gstNumber}</td>
                                                <td className="px-4 py-3 small">{client.email}</td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge state={client.accountState} />
                                                </td>
                                                <td className="px-4 py-3 small">{formatDate(client.createdAt)}</td>
                                                <td className="px-4 py-3 text-end">
                                                    <Link to={`/admin/clients/${client._id}`} className="btn btn-sm btn-outline-dark">
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination pagination-sm">
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i + 1} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(i + 1)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

export default ClientList;
