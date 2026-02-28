import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, CheckCircle, XCircle, Clock, BarChart3, Building2, Mail, ExternalLink, RefreshCw, ArrowRight, Trash2 } from 'lucide-react';
import { leadsAPI } from '../../api/leads.api';
import { formatDate, formatDateTime } from '../../utils/formatters';
import Loader from '../../components/Common/Loader';
import ErrorBox from '../../components/Common/ErrorBox';
import CallQueueSkeleton from '../../components/ui/Skeleton/CallQueueSkeleton';

function CallQueue() {
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState([]);
    const [error, setError] = useState(null);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Modal state
    const [callOutcome, setCallOutcome] = useState('INTERESTED');
    const [callNotes, setCallNotes] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');

    useEffect(() => {
        loadRecommendedCalls();
    }, []);

    const loadRecommendedCalls = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await leadsAPI.getRecommendedCalls();
            setLeads(data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load call queue');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkCalled = (lead) => {
        setSelectedLead(lead);
        setShowModal(true);
    };

    const handleDismiss = async (leadId) => {
        if (!window.confirm('Are you sure you want to dismiss this recommendation?')) return;
        try {
            await leadsAPI.markCalled(leadId, {
                callOutcome: 'NO_ANSWER',
                callNotes: 'Dismissed from queue'
            });
            setLeads(leads.filter(l => l._id !== leadId));
        } catch (err) {
            alert('Failed to dismiss lead');
        }
    };

    const saveCall = async () => {
        setSubmitting(true);
        try {
            await leadsAPI.markCalled(selectedLead._id, {
                callOutcome,
                callNotes,
                callNextFollowUpDate: followUpDate || undefined
            });
            setShowModal(false);
            setLeads(leads.filter(l => l._id !== selectedLead._id));
            // Reset form
            setCallOutcome('INTERESTED');
            setCallNotes('');
            setFollowUpDate('');
        } catch (err) {
            alert('Failed to save call details');
        } finally {
            setSubmitting(false);
        }
    };

    const getDaysSince = (date) => {
        if (!date) return 'N/A';
        const diff = new Date() - new Date(date);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return `${days}d ago`;
    };

    if (loading) return <CallQueueSkeleton />;
    if (error) return <ErrorBox error={error} onRetry={loadRecommendedCalls} />;

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'HIGH': return <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill x-small fw-bold">HIGH</span>;
            case 'MEDIUM': return <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill x-small fw-bold">MEDIUM</span>;
            case 'LOW': return <span className="badge bg-info bg-opacity-10 text-info rounded-pill x-small fw-bold">LOW</span>;
            default: return null;
        }
    };

    return (
        <div className="call-queue-page d-flex flex-column h-100 bg-white">
            {/* Action Bar */}
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between flex-shrink-0">
                <div>
                    <h5 className="fw-800 text-dark mb-1 tracking-tight">Priority Call Backlog</h5>
                    <p className="text-muted small fw-medium mb-0">High-intent prospects identified for immediate human intervention.</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <button
                        className="btn btn-white border rounded-pill d-flex align-items-center gap-2 px-3 py-2 fw-bold x-small shadow-sm transition-all hover-scale"
                        onClick={loadRecommendedCalls}
                        disabled={loading}
                    >
                        <RefreshCw size={14} className={loading ? 'spin' : ''} />
                        Sync Registry
                    </button>
                    <div className="vr h-24 opacity-10"></div>
                    <span className="badge bg-dark text-white rounded-pill px-3 py-2 small fw-bold shadow-lg">
                        {leads.length} LEADS PENDING
                    </span>
                </div>
            </div>

            {/* Scrollable Data Zone */}
            <div className="flex-grow-1 overflow-auto custom-scrollbar">
                <table className="table table-hover align-middle mb-0 modern-table">
                    <thead className="sticky-top bg-white border-bottom z-1">
                        <tr>
                            <th className="px-4 py-3 border-0 text-muted x-small fw-800 text-uppercase ls-1" style={{ width: '50px' }}>#</th>
                            <th className="px-4 py-3 border-0 text-muted x-small fw-800 text-uppercase ls-1">Lead Identity</th>
                            <th className="px-4 py-3 border-0 text-muted x-small fw-800 text-uppercase ls-1">Personal Line</th>
                            <th className="px-4 py-3 border-0 text-muted x-small fw-800 text-uppercase ls-1">Intelligence Score</th>
                            {/* <th className="px-4 py-3 border-0 text-muted x-small fw-800 text-uppercase ls-1">Outreach History</th> */}
                            <th className="px-4 py-3 border-0 text-muted x-small fw-800 text-uppercase ls-1">Recency</th>
                            <th className="px-4 py-3 border-0 text-muted x-small fw-800 text-uppercase ls-1">Priority Rank</th>
                            <th className="px-4 py-3 border-0 text-end text-muted x-small fw-800 text-uppercase ls-1 pe-4">Protocol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-5">
                                    <div className="py-5 opacity-25">
                                        <CheckCircle size={64} className="text-success mb-3" />
                                        <h5 className="fw-bold">Backlog Cleared</h5>
                                        <p className="small">All high-priority neural signals have been processed.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            leads.map((lead, idx) => (
                                <tr key={lead._id} className="modern-tr">
                                    <td className="px-4 py-4">
                                        <span className="text-muted x-small fw-800">{idx + 1}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-box me-3 bg-light text-dark rounded-3 d-flex align-items-center justify-content-center shadow-sm">
                                                <Building2 size={16} />
                                            </div>
                                            <div>
                                                <div className="fw-800 text-dark small mb-0">{lead.contactName || 'Signal Lead'}</div>
                                                <div className="text-muted x-small d-flex align-items-center gap-1">
                                                    <Mail size={10} className="opacity-50" />
                                                    {lead.company?.length > 50 ? `${lead.company.substring(0, 50)}...` : lead.company}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="bg-success bg-opacity-10 text-success p-1 rounded-circle">
                                                <Phone size={10} />
                                            </div>
                                            <span className="fw-800 small text-dark">{lead.phone || 'No Phone Data'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="fw-800 small text-dark">{lead.intentScore || 0}%</span>
                                            <div className="flex-grow-1 bg-light rounded-pill overflow-hidden" style={{ height: '4px', maxWidth: '40px' }}>
                                                <div className="h-100 bg-primary rounded-pill" style={{ width: `${lead.intentScore || 0}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* <td className="px-4 py-4">
                                        <span className="badge-modern grey x-small">{lead.emailsSent || 0} Emails Dispatched</span>
                                    </td> */}
                                    <td className="px-4 py-4">
                                        <div className="text-muted x-small d-flex align-items-center gap-1 fw-bold">
                                            <Clock size={12} className="opacity-50" />
                                            {formatDate(lead.lastEmailSentAt)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        {getPriorityBadge(lead.callPriority)}
                                    </td>
                                    <td className="px-4 py-4 text-end pe-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Link to={`/leads/${lead._id}`}
                                                className="btn btn-white border mt-2 rounded-3 px-2 py-1 x-small fw-bold text-muted transition-all d-flex align-items-center justify-content-center"
                                                title="Inspect Lead"
                                                style={{ width: '36px', height: '36px', padding: 0 }}
                                            >
                                                <ArrowRight size={14} />
                                            </Link>
                                            <button
                                                className="btn btn-success mt-2 rounded-3 px-2 py-1 x-small fw-800 d-flex align-items-center gap-2 shadow-sm transition-all hover-scale"
                                                style={{ width: '36px', height: '36px', paddingLeft: '12px' }}
                                                onClick={() => handleMarkCalled(lead)}
                                            >
                                                <Phone size={14} />
                                                 {/* Execute Call */}
                                            </button>
                                            <button
                                                onClick={() => handleDismiss(lead._id)}
                                                className="btn btn-danger border mt-2 rounded-3 px-2 py-1 x-small fw-bold text-muted transition-all"
                                                style={{ width: '36px', height: '36px', padding: 0 }}
                                            >
                                               <Trash2 size={14} />
                                                {/* Dismiss */}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}``
                    </tbody>
                </table>
            </div>

            {/* Mark Called Modal */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden animate-slide-up">
                            <div className="modal-header border-0 bg-dark text-white p-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-white bg-opacity-10 p-2 rounded-3 text-white"> <Phone size={20} /> </div>
                                    <div>
                                        <h5 className="modal-title fw-800 tracking-tight mb-0">Record Outcome</h5>
                                        <p className="x-small text-white opacity-50 mb-0">Updating intelligence record for {selectedLead?.contactName}</p>
                                    </div>
                                </div>
                                <button type="button" className="btn-close btn-close-white shadow-none" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4 bg-white">
                                <div className="mb-4">
                                    <label className="form-label x-small fw-800 text-muted text-uppercase ls-1">Intelligence Outcome</label>
                                    <div className="row g-2">
                                        {['INTERESTED', 'NOT_INTERESTED', 'CALL_BACK_LATER', 'NO_ANSWER'].map(outcome => (
                                            <div className="col-6" key={outcome}>
                                                <button
                                                    className={`btn w-100 py-3 rounded-4 x-small fw-800 border transition-all ${callOutcome === outcome ? 'bg-primary text-white border-primary shadow-primary' : 'bg-light text-muted border-transparent hover-bg-grey'}`}
                                                    onClick={() => setCallOutcome(outcome)}
                                                >
                                                    {outcome.replace('_', ' ')}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label x-small fw-800 text-muted text-uppercase ls-1">Neural Logs / Notes</label>
                                    <textarea
                                        className="form-control bg-light border-0 shadow-none small fw-medium rounded-4 p-3"
                                        rows="3"
                                        placeholder="Summarize the verbal interaction..."
                                        value={callNotes}
                                        onChange={(e) => setCallNotes(e.target.value)}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="form-label x-small fw-800 text-muted text-uppercase ls-1">Next Activation Date (Optional)</label>
                                    <input
                                        type="date"
                                        className="form-control bg-light border-0 shadow-none small fw-bold rounded-4 p-3"
                                        value={followUpDate}
                                        onChange={(e) => setFollowUpDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0 bg-white">
                                <button type="button" className="btn btn-white border rounded-pill px-4 py-2 small fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-dark rounded-pill px-4 py-2 small fw-800 shadow-xl"
                                    onClick={saveCall}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Updating Neural Record...' : 'Confirm Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .call-queue-page {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .fw-800 { font-weight: 800; }
                .tracking-tight { letter-spacing: -0.02em; }
                .x-small { font-size: 0.72rem; }
                .ls-1 { letter-spacing: 0.05em; }
                
                .hover-scale:hover { transform: scale(1.02); }
                .hover-bg-grey:hover { background: #e9ecef !important; }
                
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                .shadow-primary { box-shadow: 0 10px 20px -5px rgba(13, 110, 253, 0.4); }
                .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }

                .avatar-box {
                    width: 36px;
                    height: 36px;
                }

                .modern-tr {
                    transition: all 0.2s;
                    border-bottom: 1px solid #f0f0f0 !important;
                }
                .modern-tr:hover {
                    background: #fbfbfb !important;
                }

                .badge-modern {
                    padding: 4px 10px;
                    border-radius: 100px;
                    font-weight: 700;
                    text-transform: uppercase;
                    border: 1px solid transparent;
                }
                .badge-modern.grey { background: #f8f9fa; color: #6c757d; font-size: 10px; border-color: #eee; }

                .btn-white { background: white; color: #333; }
                .btn-white:hover { background: #f8f9fa; }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin { animation: spin 1s linear infinite; }

                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: white; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ddd; }
            `}</style>
        </div>
    );
}

export default CallQueue;
