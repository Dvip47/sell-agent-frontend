import { useState, useEffect } from 'react';
import { Mail, Check, X, AlertCircle, Send } from 'lucide-react';
import { emailConfigAPI } from '../api/emailConfig.api';

/**
 * EmailConfigSection Component
 * 
 * Simple, non-technical email configuration UI.
 */
function EmailConfigSection({ productId, emailConfig, onUpdate }) {
    const [mode, setMode] = useState(emailConfig?.mode || 'DISABLED');
    const [gmailStatus, setGmailStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [testingEmail, setTestingEmail] = useState(false);

    useEffect(() => {
        if (mode === 'TENANT') {
            loadGmailStatus();
        }
    }, [mode]);

    const loadGmailStatus = async () => {
        try {
            const status = await emailConfigAPI.getGmailStatus(productId);
            setGmailStatus(status);
        } catch (error) {
            console.error('Failed to load Gmail status:', error);
        }
    };

    const handleModeChange = async (newMode) => {
        setMode(newMode);
        await onUpdate({ mode: newMode });

        if (newMode === 'TENANT') {
            loadGmailStatus();
        }
    };

    const handleConnectGmail = async () => {
        setLoading(true);
        try {
            const { authUrl } = await emailConfigAPI.getGmailAuthUrl(productId);
            window.location.href = authUrl;
        } catch (error) {
            alert('Failed to start Gmail connection: ' + error.message);
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm('Disconnect Gmail? Emails will be disabled.')) return;

        setLoading(true);
        try {
            await emailConfigAPI.disconnectGmail(productId);
            setGmailStatus(null);
            await handleModeChange('DISABLED');
            alert('Gmail disconnected successfully');
        } catch (error) {
            alert('Failed to disconnect: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTestEmail = async () => {
        setTestingEmail(true);
        try {
            await emailConfigAPI.sendTestEmail(productId);
            alert('  Test email sent! Check your inbox.');
        } catch (error) {
            alert('❌ Test email failed: ' + error.message);
        } finally {
            setTestingEmail(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                    <div className="p-2 bg-primary bg-opacity-10 rounded-3">
                        <Mail size={20} className="text-primary" />
                    </div>
                    <div>
                        <h5 className="fw-bold mb-0">Email Sending Settings</h5>
                        <p className="text-muted small mb-0">Choose how emails will be sent for this product</p>
                    </div>
                </div>

                {/* 📖 Beginner-Friendly Guide */}
                <div className="alert alert-info border-0 bg-info bg-opacity-10 mb-4">
                    <div className="d-flex gap-2">
                        <div className="text-info" style={{ minWidth: '24px' }}>ℹ️</div>
                        <div className="small">
                            <div className="fw-bold text-dark mb-2">🎯 Quick Setup Guide (3 Steps):</div>
                            <ol className="mb-0 ps-3">
                                <li className="mb-1"><strong>Choose Email Mode</strong> below - We recommend "Send from My Gmail"</li>
                                <li className="mb-1"><strong>Click "Connect Gmail"</strong> button - Login with Google and give permission</li>
                                <li className="mb-0"><strong>Test It!</strong> - Click "Send Test Email" to make sure it works</li>
                            </ol>
                            <div className="mt-2 p-2 bg-white rounded border-start border-3 border-success">
                                <strong className="text-success">💡 Important:</strong> You only do this <u>once per product</u>.
                                After setup, all emails send automatically - no need to reconnect!
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 1: Choose Email Mode */}
                <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted">Email Mode</label>
                    <select
                        className="form-select"
                        value={mode}
                        onChange={(e) => handleModeChange(e.target.value)}
                        disabled={loading}
                    >
                        <option value="DISABLED">Disable Email Sending</option>
                        <option value="TENANT">Send from My Gmail (Recommended)</option>
                        <option value="ENV">Use System Default Email</option>
                    </select>

                    {/* Mode descriptions */}
                    <div className="mt-2">
                        {mode === 'TENANT' && (
                            <div className="alert alert-info border-0 small py-2 px-3 mb-0">
                                <strong>Gmail Mode:</strong> Emails will be sent from your own Gmail account.
                            </div>
                        )}
                        {mode === 'ENV' && (
                            <div className="alert alert-secondary border-0 small py-2 px-3 mb-0">
                                <strong>System Mode:</strong> Emails will be sent from the platform's default email.
                            </div>
                        )}
                        {mode === 'DISABLED' && (
                            <div className="alert alert-warning border-0 small py-2 px-3 mb-0">
                                <strong>Disabled:</strong> No emails will be sent from this product.
                            </div>
                        )}
                    </div>
                </div>

                {/* Step 2: Gmail Connection (if TENANT mode) */}
                {mode === 'TENANT' && (
                    <div className="border-top pt-4">
                        <label className="form-label small fw-bold text-uppercase text-muted mb-3">Gmail Connection</label>

                        {!gmailStatus?.connected ? (
                            <div>
                                <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                                    <AlertCircle size={18} className="text-muted" />
                                    <span className="small text-muted">No Gmail account connected yet.</span>
                                </div>
                                <button
                                    className="btn btn-primary d-flex align-items-center gap-2"
                                    onClick={handleConnectGmail}
                                    disabled={loading}
                                >
                                    <Mail size={16} />
                                    {loading ? 'Connecting...' : 'Connect Gmail'}
                                </button>
                            </div>
                        ) : (
                            <div className="card border shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <div className="small text-muted text-uppercase fw-bold mb-1">Connected Email</div>
                                            <div className="fw-bold">{gmailStatus.emailAddress}</div>
                                        </div>
                                        <span className={`badge ${gmailStatus.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                                            {gmailStatus.status}
                                        </span>
                                    </div>

                                    {gmailStatus.lastError && (
                                        <div className="alert alert-danger border-0 small py-2 px-3 mb-3">
                                            <strong>Error:</strong> {gmailStatus.lastError}
                                        </div>
                                    )}

                                    {gmailStatus.status === 'ACTIVE' && (
                                        <div className="small text-muted mb-3">
                                            Emails sent today: <strong>{gmailStatus.emailsSentToday}/{gmailStatus.dailyLimit}</strong>
                                        </div>
                                    )}

                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                            onClick={handleTestEmail}
                                            disabled={testingEmail || gmailStatus.status !== 'ACTIVE'}
                                        >
                                            <Send size={14} />
                                            {testingEmail ? 'Sending...' : 'Send Test Email'}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                            onClick={handleDisconnect}
                                            disabled={loading}
                                        >
                                            <X size={14} />
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Warning if ENV mode but not configured */}
                {mode === 'ENV' && (
                    <div className="alert alert-warning border-0 small mt-3">
                        <strong>Note:</strong> System email must be configured by the administrator. If you see delivery issues, contact support.
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmailConfigSection;
