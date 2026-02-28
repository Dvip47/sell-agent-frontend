import { useState, useEffect } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import Loader from '../components/Common/Loader';
import { executionAPI } from '../api/execution.api';
import { leadsAPI } from '../api/leads.api';

/**
 * Test Harness Page
 * 
 * Admin-only tool for deterministic testing.
 * Inject leads and mock replies without waiting for real infrastructure.
 */
function TestHarness() {
    const [loading, setLoading] = useState(false);
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState('');
    const [mockReply, setMockReply] = useState("I'm interested in learning more about your product. Can we hop on a call tomorrow at 11am?");
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        try {
            const data = await leadsAPI.getLeads({ limit: 50 });
            setLeads(data.leads || []);
        } catch (err) {
            console.error('Failed to load leads', err);
        }
    };

    const handleInjectLead = async () => {
        setLoading(true);
        setMessage(null);
        try {
            await executionAPI.injectLead();
            setMessage({ type: 'success', text: 'Test lead injected successfully. Check Execution Logs.' });
            loadLeads();
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to inject lead' });
        } finally {
            setLoading(false);
        }
    };

    const handleInjectReply = async () => {
        if (!selectedLead) return alert('Please select a lead first');
        setLoading(true);
        setMessage(null);
        try {
            await executionAPI.injectReply(selectedLead, mockReply);
            setMessage({ type: 'success', text: 'Mock reply injected. Processing cycle will pick it up.' });
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to inject reply' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col">
                        <h4 className="fw-normal text-dark">Deterministic Test Harness</h4>
                        <p className="text-muted small mb-0">Force engine events for end-to-end verification</p>
                    </div>
                </div>

                {message && (
                    <div className={`alert alert-${message.type} border-0 shadow-sm mb-4`}>
                        {message.text}
                    </div>
                )}

                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white pt-4 px-4 border-0">
                                <h6 className="mb-0">Lead Injection</h6>
                            </div>
                            <div className="card-body p-4">
                                <p className="text-muted small mb-4">
                                    Adds a new lead directly into the 'DISCOVERED' state.
                                    This triggers the filtering and outreach pipeline on the next run.
                                </p>
                                <div className="p-4 bg-light rounded-3 text-center">
                                    <i className="bi bi-person-plus fs-1 text-muted opacity-25 mb-3 d-block"></i>
                                    <button
                                        className="btn btn-dark px-4"
                                        onClick={handleInjectLead}
                                        disabled={loading}
                                    >
                                        {loading ? 'Injecting...' : 'Inject Test Lead -> Discovered Store'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white pt-4 px-4 border-0">
                                <h6 className="mb-0">Inbox Simulation</h6>
                            </div>
                            <div className="card-body p-4">
                                <p className="text-muted small mb-4">
                                    Simulate a prospect replying to an email.
                                    Triggers the 'RESPONDED' classification and meeting booking logic.
                                </p>
                                <div className="mb-3">
                                    <label className="form-label x-small text-uppercase fw-bold text-muted">Select Target Lead</label>
                                    <select
                                        className="form-select shadow-none"
                                        value={selectedLead}
                                        onChange={(e) => setSelectedLead(e.target.value)}
                                    >
                                        <option value="">-- Select Active Lead --</option>
                                        {leads.map(lead => (
                                            <option key={lead._id} value={lead._id}>
                                                {lead.company} ({lead.state})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label x-small text-uppercase fw-bold text-muted">Mock Message Content</label>
                                    <textarea
                                        className="form-control shadow-none"
                                        rows="3"
                                        value={mockReply}
                                        onChange={(e) => setMockReply(e.target.value)}
                                    ></textarea>
                                </div>
                                <button
                                    className="btn btn-outline-dark w-100"
                                    onClick={handleInjectReply}
                                    disabled={loading || !selectedLead}
                                >
                                    {loading ? 'Processing...' : 'Inject Positive Reply'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5 p-4 bg-dark text-white rounded-3 shadow-sm">
                    <h6 className="text-info x-small text-uppercase tracking-widest mb-3">Testing Safety Notice</h6>
                    <p className="small mb-0 opacity-75">
                        These tools bypass the discovery engine but abide by all safety filters,
                        quota limits, and state machine transition rules.
                        Testing is only enabled when <code>IS_EMAIL_TESTING=true</code>.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

export default TestHarness;
