import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Play, Pause, Shield, Activity, HardDrive,
    Mail, User as UserIcon, Lock, Unlock, AlertTriangle,
    CheckCircle2, RefreshCw, Info, ChevronRight, Terminal,
    Cpu, Briefcase, Zap, Search, Trash2, Key, ExternalLink,
    Eye, EyeOff, Settings as SettingsIcon, Check, X, Copy
} from 'lucide-react';
import AppLayout from '../components/Layout/AppLayout';
import Loader from '../components/Common/Loader';
import ErrorBox from '../components/Common/ErrorBox';
import StatusBadge from '../components/Common/StatusBadge';
import { executionAPI } from '../api/execution.api';
import { logsAPI } from '../api/logs.api';
import { oauthConfigAPI } from '../api/oauthConfig.api';
import SettingsSkeleton from '../components/ui/Skeleton/SettingsSkeleton';

function Settings() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [engineStatus, setEngineStatus] = useState(null);
    const [statusData, setStatusData] = useState(null);
    const [activeTab, setActiveTab] = useState('engine');

    // Logs state
    const [logs, setLogs] = useState([]);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [clearing, setClearing] = useState(false);
    const logEndRef = useRef(null);

    // OAuth config state
    const [oauthStatus, setOauthStatus] = useState(null);
    const [oauthLoading, setOauthLoading] = useState(false);
    const [oauthSaving, setOauthSaving] = useState(false);
    const [oauthForm, setOauthForm] = useState({ clientId: '', clientSecret: '' });
    const [showSecret, setShowSecret] = useState(false);
    const [oauthMessage, setOauthMessage] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'ADMIN';

    const BLOCKED_REASONS = {
        NO_ACTIVE_PRODUCT: "Select an active product from the Intelligence Portfolio.",
        NO_PERSONA: "Authorize the engine in Product Setup to generate a sales persona.",
        PRODUCT_NOT_READY: "Product Setup Incomplete. Complete all steps and authorize launch.",
        TENANT_NOT_ACTIVE: "Account verification pending. Engine cannot run.",
        ENGINE_ALREADY_RUNNING: "Engine is already running.",
        UNKNOWN: "Execution is currently unavailable.",
        NONE: ""
    };

    useEffect(() => {
        loadData();
        loadOAuthStatus();
    }, []);

    useEffect(() => {
        let interval;
        if (autoRefresh && !loading && !error) {
            interval = setInterval(pollLogs, 3000);
        }
        return () => clearInterval(interval);
    }, [autoRefresh, logs, loading, error]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [status, logsData] = await Promise.all([
                executionAPI.getOperationalStatus(),
                logsAPI.getLogs({ limit: 50 })
            ]);
            setStatusData(status);
            setEngineStatus(status.engineStatus);
            if (logsData?.logs) setLogs([...logsData.logs].reverse());
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to sync with engine');
        } finally {
            setLoading(false);
        }
    };

    const loadOAuthStatus = async () => {
        setOauthLoading(true);
        try {
            const data = await oauthConfigAPI.getCredentials();
            setOauthStatus(data);
        } catch (err) {
            console.error('Failed to load OAuth status', err);
        } finally {
            setOauthLoading(false);
        }
    };

    const pollLogs = async () => {
        try {
            const lastTimestamp = logs.length > 0 ? logs[logs.length - 1].timestamp : null;
            const logsData = await logsAPI.getLogs({ since: lastTimestamp, limit: 50 });
            if (logsData?.logs?.length > 0) {
                const newLogs = [...logsData.logs].reverse();
                setLogs(prev => [...prev, ...newLogs]);
                logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (err) {
            console.error('Log polling failed', err);
        }
    };

    const loadStatus = async () => {
        try {
            const data = await executionAPI.getOperationalStatus();
            setStatusData(data);
            setEngineStatus(data.engineStatus);
        } catch (err) {
            console.error('Status reload failed', err);
        }
    };

    const [resumeMessage, setResumeMessage] = useState('');

    const handleResume = async () => {
        setActionLoading(true);
        setResumeMessage('');
        try {
            await executionAPI.resume();
            setEngineStatus('RUNNING');
            setResumeMessage('Cooldown overridden. Engine starting cycle.');
            loadStatus();
            setTimeout(() => setResumeMessage(''), 5000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to resume engine');
        } finally {
            setActionLoading(false);
        }
    };

    const handlePause = async () => {
        setActionLoading(true);
        try {
            await executionAPI.pause();
            setEngineStatus('PAUSED');
            loadStatus();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to pause engine');
        } finally {
            setActionLoading(false);
        }
    };

    const handleClearLogs = async () => {
        if (!window.confirm('Are you sure you want to clear all logs?')) return;
        setClearing(true);
        try {
            await logsAPI.clearLogs();
            setLogs([]);
        } catch (err) {
            alert('Failed to clear logs');
        } finally {
            setClearing(false);
        }
    };

    const handleSaveOAuth = async () => {
        if (!oauthForm.clientId.trim() || !oauthForm.clientSecret.trim()) {
            setOauthMessage({ type: 'error', text: 'Both Client ID and Client Secret are required.' });
            return;
        }
        if (!oauthForm.clientId.includes('.apps.googleusercontent.com')) {
            setOauthMessage({ type: 'error', text: 'Invalid Client ID format. It should end with .apps.googleusercontent.com' });
            return;
        }
        setOauthSaving(true);
        setOauthMessage(null);
        try {
            await oauthConfigAPI.saveCredentials(oauthForm.clientId.trim(), oauthForm.clientSecret.trim());
            setOauthMessage({ type: 'success', text: 'OAuth credentials saved! Now connect your Gmail in Product Setup.' });
            setOauthForm({ clientId: '', clientSecret: '' });
            loadOAuthStatus();
        } catch (err) {
            setOauthMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save credentials' });
        } finally {
            setOauthSaving(false);
        }
    };

    const handleRemoveOAuth = async () => {
        if (!window.confirm('Remove custom credentials and revert to system defaults?')) return;
        try {
            await oauthConfigAPI.removeCredentials();
            setOauthMessage({ type: 'success', text: 'Custom credentials removed. System default will be used.' });
            loadOAuthStatus();
        } catch (err) {
            setOauthMessage({ type: 'error', text: 'Failed to remove credentials' });
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setOauthMessage({ type: 'info', text: 'Copied to clipboard!' });
            setTimeout(() => setOauthMessage(null), 2000);
        });
    };

    const getAgentStatusDisplay = (agent) => {
        if (!agent) return 'UNKNOWN';
        if (agent.executionLock?.isLocked && agent.executionLock?.lockedAt) {
            const lockAge = Date.now() - new Date(agent.executionLock.lockedAt).getTime();
            if (lockAge < 10 * 60 * 1000) return 'RUNNING';
            return 'LOCK_STALE';
        }
        if (agent.status === 'ERROR_BLOCKED') return 'ERROR_BLOCKED';
        if (agent.nextAllowedRunAt && new Date(agent.nextAllowedRunAt) > new Date()) return 'COOLDOWN';
        return 'READY';
    };

    const getExecutionLockInfo = (agent) => {
        if (!agent?.executionLock) return null;
        const lock = agent.executionLock;
        if (!lock.isLocked || !lock.lockedAt) return { state: 'FREE', message: null };
        const lockAge = Date.now() - new Date(lock.lockedAt).getTime();
        const ageMinutes = Math.round(lockAge / (1000 * 60));
        if (lockAge < 10 * 60 * 1000) return { state: 'ACTIVE', message: `Lock: ${lock.runId?.substring(0, 8) || 'RUNNING'}... (${ageMinutes}m ago)` };
        return { state: 'STALE', message: `Stale lock (${ageMinutes}m old)` };
    };

    const formatTime = (isoString) => {
        if (!isoString) return '--:--:--';
        try { return new Date(isoString).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
        catch (e) { return '--:--:--'; }
    };

    const getLevelColor = (level, category) => {
        if (category === 'RAW') return 'text-secondary';
        switch (level) {
            case 'ERROR': return 'text-danger fw-bold';
            case 'WARN': return 'text-warning fw-bold';
            case 'INFO': return 'text-info';
            default: return 'text-muted';
        }
    };

    if (loading && !statusData) return <AppLayout><SettingsSkeleton /></AppLayout>;
    if (error) return <AppLayout><ErrorBox error={error} onRetry={loadData} /></AppLayout>;

    const activeAgents = statusData?.activeAgents || [];
    const redirectUri = oauthStatus?.redirectUri || 'http://localhost:3001/oauth/gmail/callback';

    return (
        <AppLayout>
            <div className="container-fluid py-4 px-4">
                {/* Header */}
                <div className="row mb-4 align-items-center">
                    <div className="col">
                        <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-3">
                            Engine Intelligence Hub
                        </h2>
                        <div className="d-flex align-items-center text-muted small">
                            <Cpu size={14} className="me-2" />
                            System Core v2.4 &bull; Multi-Agent Orchestration
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="bg-white border shadow-sm rounded-pill p-1 d-flex align-items-center gap-3">
                            <div className="form-check form-switch mb-0 ps-5 me-2">
                                <input className="form-check-input shadow-none cursor-pointer" type="checkbox" id="autoRefreshSwitch"
                                    checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
                                <label className="form-check-label x-small fw-bold text-uppercase ls-1" htmlFor="autoRefreshSwitch">Auto-refresh Logs</label>
                            </div>
                            <button className="btn btn-dark rounded-pill px-4 x-small fw-bold d-flex align-items-center gap-2" onClick={loadData}>
                                <RefreshCw size={12} /> SYNC
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="d-flex gap-2 mb-4 border-bottom">
                    <button
                        className={`btn btn-sm rounded-top rounded-bottom-0 px-4 py-2 fw-bold ${activeTab === 'engine' ? 'btn-dark' : 'btn-light text-muted'}`}
                        onClick={() => setActiveTab('engine')}
                    >
                        <Activity size={14} className="me-2" />Engine Control
                    </button>
                    <button
                        className={`btn btn-sm rounded-top rounded-bottom-0 px-4 py-2 fw-bold ${activeTab === 'oauth' ? 'btn-dark' : 'btn-light text-muted'}`}
                        onClick={() => setActiveTab('oauth')}
                    >
                        <Key size={14} className="me-2" />Google OAuth Setup
                        {!oauthStatus?.systemDefaultConfigured && !oauthStatus?.hasCustomCredentials && (
                            <span className="badge bg-danger ms-2" style={{ fontSize: '9px' }}>!</span>
                        )}
                    </button>
                </div>

                {/* ===================== TAB: ENGINE CONTROL ===================== */}
                {activeTab === 'engine' && (
                    <div className="row g-4">
                        <div className="col-lg-8">
                            {/* Global Execution Control Card */}
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 text-white">
                                <div className={`p-4 ${engineStatus === 'RUNNING' ? 'bg-dark' : 'bg-secondary'}`}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <div className={`avatar-md rounded-circle d-flex align-items-center justify-content-center me-3 ${engineStatus === 'RUNNING' ? 'bg-success bg-opacity-10 text-success' : 'bg-white bg-opacity-10 text-white'}`}>
                                                <Activity size={32} className={engineStatus === 'RUNNING' ? 'animate-pulse' : ''} />
                                            </div>
                                            <div>
                                                <h5 className="mb-0 fw-bold text-white">Autonomous Orchestrator</h5>
                                                <div className="small opacity-75">Global State: <span className="fw-bold text-uppercase">{engineStatus}</span></div>
                                            </div>
                                        </div>
                                        <StatusBadge state={engineStatus} size="lg" />
                                    </div>
                                </div>
                                <div className="card-body p-4 bg-white text-dark">
                                    {resumeMessage && (
                                        <div className="alert bg-success-subtle text-success border-0 small d-flex align-items-center gap-2 mb-4 p-3 rounded-3">
                                            <CheckCircle2 size={16} /> {resumeMessage}
                                        </div>
                                    )}
                                    <div className="row g-4 align-items-center">
                                        <div className="col-md-7">
                                            <p className="text-muted small mb-4">
                                                {engineStatus === 'RUNNING'
                                                    ? 'System Core is actively orchestrating all configured agents for multi-product outreach.'
                                                    : 'Orchestrator is on standby. All active agents are paused.'}
                                            </p>
                                            <div className="d-flex gap-3 mt-2">
                                                <button
                                                    className="btn btn-dark px-4 py-2 d-flex align-items-center gap-2 rounded-pill fw-bold border-2"
                                                    style={{ borderColor: engineStatus === 'RUNNING' ? '#198754' : 'transparent' }}
                                                    onClick={handleResume}
                                                    disabled={actionLoading || !statusData?.canResume || !isAdmin || engineStatus === 'RUNNING'}
                                                >
                                                    <Play size={16} className="text-success fill-success" />
                                                    {actionLoading ? 'Deploying...' : 'RESUME SYSTEM'}
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger px-4 py-2 d-flex align-items-center gap-2 rounded-pill fw-bold"
                                                    onClick={handlePause}
                                                    disabled={actionLoading || engineStatus !== 'RUNNING' || !isAdmin}
                                                >
                                                    <Pause size={16} /> STOP SYSTEM
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-5 border-start bg-light bg-opacity-50 p-4 rounded-end-4">
                                            <h6 className="small fw-bold text-uppercase text-muted ls-1 mb-3">Cluster Status</h6>
                                            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                                                <li className="d-flex justify-content-between small">
                                                    <span className="text-muted">Total Agents</span>
                                                    <span className="fw-bold text-primary">{activeAgents.length}</span>
                                                </li>
                                                <li className="d-flex justify-content-between small">
                                                    <span className="text-muted">Ready Products</span>
                                                    <span className="fw-bold text-dark">{statusData?.readyProductCount || 0}</span>
                                                </li>
                                                <li className="d-flex justify-content-between small">
                                                    <span className="text-muted">Account Authority</span>
                                                    <span className="text-success fw-bold">MASTER_VERIFIED</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ACTIVE AGENTS GRID */}
                            <div className="row g-4 mb-4">
                                {activeAgents.length === 0 ? (
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm rounded-4 bg-light p-5 text-center">
                                            <Zap size={32} className="text-muted mb-3 mx-auto" />
                                            <h6 className="fw-bold text-dark">No Active Agents Deployed</h6>
                                            <p className="small text-muted mb-0">Launch agents from the Product Portfolio to start discovery.</p>
                                        </div>
                                    </div>
                                ) : (
                                    activeAgents.map(agent => {
                                        const aStatus = getAgentStatusDisplay(agent);
                                        const lockInfo = getExecutionLockInfo(agent);
                                        return (
                                            <div className="col-md-6" key={agent.id}>
                                                <div className="card border-0 shadow-sm rounded-4 h-100 border-start border-4" style={{ borderColor: aStatus === 'RUNNING' ? '#198754' : aStatus === 'COOLDOWN' ? '#ffc107' : '#dee2e6' }}>
                                                    <div className="card-body p-4">
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div className="bg-dark rounded-circle p-2 text-white d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                                                    <UserIcon size={16} />
                                                                </div>
                                                                <div>
                                                                    <h6 className="fw-bold mb-0">{agent.name || 'Anonymous Agent'}</h6>
                                                                    <span className="x-small text-muted text-uppercase tracking-wider">{agent.productId?.name || 'Assigned Product'}</span>
                                                                </div>
                                                            </div>
                                                            <span className={`badge rounded-pill px-2 py-1 x-small fw-bold ${aStatus === 'RUNNING' ? 'bg-success text-white' : aStatus === 'COOLDOWN' ? 'bg-warning text-dark' : 'bg-secondary text-white'}`}>
                                                                {aStatus}
                                                            </span>
                                                        </div>
                                                        <div className="bg-light p-3 rounded-3 mb-3">
                                                            {lockInfo?.state !== 'FREE' && (
                                                                <div className={`x-small fw-bold d-flex align-items-center gap-2 mb-2 ${lockInfo.state === 'STALE' ? 'text-danger' : 'text-primary'}`}>
                                                                    <Lock size={12} /> {lockInfo.message}
                                                                </div>
                                                            )}
                                                            <div className="d-flex justify-content-between x-small text-break">
                                                                <span className="text-muted flex-shrink-0 me-2">Agent ID:</span>
                                                                <code className="text-dark">{agent.id}</code>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                                            <div className="x-small text-muted d-flex align-items-center gap-2">
                                                                <Activity size={12} />
                                                                {aStatus === 'COOLDOWN' && agent.nextAllowedRunAt
                                                                    ? <span>Resume in {Math.round((new Date(agent.nextAllowedRunAt) - new Date()) / 60000)}m</span>
                                                                    : <span>Active Duty</span>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 mb-4">
                                <div className="card-body p-4">
                                    <h6 className="fw-bold text-dark mb-4 d-flex align-items-center text-uppercase ls-1 small">
                                        <Terminal size={18} className="me-2 text-muted" /> Machine Diagnostics
                                    </h6>
                                    <div className="d-flex flex-column gap-4">
                                        <div>
                                            <label className="x-small text-uppercase text-muted fw-bold ls-1 mb-2 d-block">System Load</label>
                                            <div className="progress rounded-pill bg-light" style={{ height: '8px' }}>
                                                <div className="progress-bar bg-primary rounded-pill" style={{ width: engineStatus === 'RUNNING' ? '45%' : '5%' }}></div>
                                            </div>
                                        </div>
                                        <div className="pt-2 border-top">
                                            <div className="d-flex justify-content-between small text-muted mb-2">
                                                <span>Operational:</span>
                                                <span className={`fw-bold ${statusData?.operationalStatus === 'READY' ? 'text-success' : 'text-danger'}`}>
                                                    {statusData?.operationalStatus || 'BLOCKED'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {statusData?.blockedReason && statusData.blockedReason !== 'NONE' && (
                                <div className="card border-0 shadow-sm rounded-4 bg-warning-subtle text-warning-emphasis">
                                    <div className="card-body p-4 d-flex align-items-start gap-3">
                                        <AlertTriangle size={20} className="mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="fw-bold small mb-1 text-uppercase ls-1">Core Constraint</div>
                                            <p className="x-small mb-0 opacity-75">{BLOCKED_REASONS[statusData.blockedReason] || BLOCKED_REASONS.UNKNOWN}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ===================== TAB: GOOGLE OAUTH SETUP ===================== */}
                {activeTab === 'oauth' && (
                    <div className="row g-4">
                        <div className="col-lg-7">

                            {/* Current Status Card */}
                            <div className="card border-0 shadow-sm rounded-4 mb-4">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="p-2 rounded-3" style={{ background: 'linear-gradient(135deg, #4285f4, #34a853)' }}>
                                            <Key size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0">Google OAuth Credentials</h5>
                                            <p className="text-muted small mb-0">Configure your own Google Cloud app credentials</p>
                                        </div>
                                        {oauthLoading && <div className="spinner-border spinner-border-sm text-muted ms-auto" />}
                                    </div>

                                    {/* Status Banner */}
                                    {oauthStatus && (
                                        <div className={`p-3 rounded-3 mb-4 d-flex align-items-start gap-3 ${oauthStatus.hasCustomCredentials ? 'bg-success bg-opacity-10' : oauthStatus.systemDefaultConfigured ? 'bg-info bg-opacity-10' : 'bg-warning bg-opacity-10'}`}>
                                            <div className="mt-1">
                                                {oauthStatus.hasCustomCredentials
                                                    ? <CheckCircle2 size={18} className="text-success" />
                                                    : oauthStatus.systemDefaultConfigured
                                                        ? <Info size={18} className="text-info" />
                                                        : <AlertTriangle size={18} className="text-warning" />
                                                }
                                            </div>
                                            <div>
                                                {oauthStatus.hasCustomCredentials ? (
                                                    <>
                                                        <div className="fw-bold small text-success">Custom Credentials Active</div>
                                                        <div className="x-small text-muted">Client ID: <code>{oauthStatus.clientId}</code></div>
                                                        <button className="btn btn-sm btn-outline-danger mt-2 x-small" onClick={handleRemoveOAuth}>
                                                            <X size={12} className="me-1" />Remove &amp; Use System Default
                                                        </button>
                                                    </>
                                                ) : oauthStatus.systemDefaultConfigured ? (
                                                    <>
                                                        <div className="fw-bold small text-info">Using System Default Credentials</div>
                                                        <div className="x-small text-muted mt-1">
                                                            These are shared credentials. If you get "Access Blocked" errors, add your email as a test user
                                                            in Google Cloud Console, or enter your own credentials below.
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="fw-bold small text-warning">No OAuth Credentials Configured</div>
                                                        <div className="x-small text-muted mt-1">
                                                            Set up your own Google OAuth credentials below to connect Gmail.
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Feedback Message */}
                                    {oauthMessage && (
                                        <div className={`alert border-0 small mb-3 d-flex align-items-center gap-2 ${oauthMessage.type === 'success' ? 'alert-success' : oauthMessage.type === 'error' ? 'alert-danger' : 'alert-info'}`}>
                                            {oauthMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                                            {oauthMessage.text}
                                        </div>
                                    )}

                                    {/* Credential Form */}
                                    <div className="border-top pt-4">
                                        <h6 className="fw-bold small text-uppercase text-muted ls-1 mb-3">Enter Your OAuth Credentials</h6>
                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold">Google Client ID</label>
                                            <input
                                                type="text"
                                                className="form-control font-monospace small"
                                                placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                                                value={oauthForm.clientId}
                                                onChange={e => setOauthForm(f => ({ ...f, clientId: e.target.value }))}
                                            />
                                            <div className="text-muted" style={{ fontSize: '11px', marginTop: 4 }}>Ends with .apps.googleusercontent.com</div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label small fw-semibold">Client Secret</label>
                                            <div className="input-group">
                                                <input
                                                    type={showSecret ? 'text' : 'password'}
                                                    className="form-control font-monospace small"
                                                    placeholder="GOCSPX-..."
                                                    value={oauthForm.clientSecret}
                                                    onChange={e => setOauthForm(f => ({ ...f, clientSecret: e.target.value }))}
                                                />
                                                <button className="btn btn-outline-secondary" onClick={() => setShowSecret(v => !v)}>
                                                    {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                            <div className="text-muted" style={{ fontSize: '11px', marginTop: 4 }}>Stored encrypted. Never exposed in the UI after saving.</div>
                                        </div>
                                        <button
                                            className="btn btn-dark fw-bold d-flex align-items-center gap-2"
                                            onClick={handleSaveOAuth}
                                            disabled={oauthSaving || !oauthForm.clientId || !oauthForm.clientSecret}
                                        >
                                            {oauthSaving ? <><span className="spinner-border spinner-border-sm" />Saving...</> : <><Check size={16} />Save Credentials</>}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Redirect URI Card */}
                            <div className="card border-0 shadow-sm rounded-4 mb-4">
                                <div className="card-body p-4">
                                    <h6 className="fw-bold small text-uppercase text-muted ls-1 mb-3">Authorized Redirect URI</h6>
                                    <p className="text-muted small mb-3">
                                        Add this exact URL in your Google Cloud Console under Authorized Redirect URIs:
                                    </p>
                                    <div className="d-flex align-items-center gap-2">
                                        <code className="bg-light px-3 py-2 rounded-3 small flex-grow-1 text-break">{redirectUri}</code>
                                        <button className="btn btn-outline-secondary btn-sm" onClick={() => copyToClipboard(redirectUri)} title="Copy">
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column: Step by step guide */}
                        <div className="col-lg-5">
                            <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '20px' }}>
                                <div className="card-header border-0 bg-dark text-white p-4 rounded-top-4">
                                    <h6 className="fw-bold mb-1">🔧 Step-by-Step Setup Guide</h6>
                                    <p className="x-small opacity-75 mb-0">Follow these steps in Google Cloud Console</p>
                                </div>
                                <div className="card-body p-4">

                                    {/* Quick Fix Banner */}
                                    <div className="p-3 rounded-3 mb-4" style={{ background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', border: '1px solid #c8e6c9' }}>
                                        <div className="fw-bold small text-success mb-1">⚡ Quick Fix (5 min)</div>
                                        <p className="x-small text-muted mb-2">
                                            If you just want to add one Gmail account and you're getting "Access Blocked":
                                        </p>
                                        <a
                                            href="https://console.cloud.google.com/apis/credentials/consent"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-success fw-bold d-flex align-items-center gap-2 w-100 justify-content-center"
                                        >
                                            <ExternalLink size={14} />Open Google Cloud Console
                                        </a>
                                        <p className="x-small text-muted mt-2 mb-0">
                                            Then scroll to <strong>"Test users"</strong> → <strong>"+ Add Users"</strong> → add your Gmail
                                        </p>
                                    </div>

                                    {/* Full Setup Steps */}
                                    <div className="fw-bold small text-muted text-uppercase ls-1 mb-3">Full OAuth App Setup</div>

                                    {[
                                        {
                                            step: 1,
                                            title: 'Go to Google Cloud Console',
                                            desc: 'Open console.cloud.google.com and select your project (or create one).',
                                            link: 'https://console.cloud.google.com',
                                            linkText: 'Open Google Cloud Console'
                                        },
                                        {
                                            step: 2,
                                            title: 'Configure OAuth Consent Screen',
                                            desc: 'Go to APIs & Services → OAuth consent screen. Set app name to "SellAgent". Under Publishing Status, click "Publish App" to allow any Gmail to sign in (or keep Testing and add emails as test users).',
                                            link: 'https://console.cloud.google.com/apis/credentials/consent',
                                            linkText: 'OAuth Consent Screen'
                                        },
                                        {
                                            step: 3,
                                            title: 'Add Gmail Send Scope',
                                            desc: 'In OAuth consent screen → Scopes → Add/remove scopes → manually type: https://www.googleapis.com/auth/gmail.send → Save.',
                                            link: null
                                        },
                                        {
                                            step: 4,
                                            title: 'Create OAuth 2.0 Credentials',
                                            desc: 'APIs & Services → Credentials → + Create Credentials → OAuth client ID → Web application.',
                                            link: 'https://console.cloud.google.com/apis/credentials',
                                            linkText: 'Open Credentials'
                                        },
                                        {
                                            step: 5,
                                            title: 'Add Redirect URI',
                                            desc: 'Under "Authorized redirect URIs", add the URL shown in the card on the left. Click Save.',
                                            link: null
                                        },
                                        {
                                            step: 6,
                                            title: 'Copy & Save Here',
                                            desc: 'Copy your Client ID and Client Secret from Google Cloud. Paste them in the form on the left and click Save Credentials.',
                                            link: null
                                        },
                                        {
                                            step: 7,
                                            title: 'Connect Gmail in Product Setup',
                                            desc: 'Go to Product Setup → Email Settings → Select "Send from My Gmail" → Click "Connect Gmail" and authorize.',
                                            link: null
                                        }
                                    ].map(({ step, title, desc, link, linkText }) => (
                                        <div key={step} className="d-flex gap-3 mb-4">
                                            <div className="flex-shrink-0 rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 28, height: 28, fontSize: 12 }}>
                                                {step}
                                            </div>
                                            <div>
                                                <div className="fw-bold small mb-1">{title}</div>
                                                <p className="x-small text-muted mb-2">{desc}</p>
                                                {link && (
                                                    <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-dark x-small fw-bold d-inline-flex align-items-center gap-1">
                                                        <ExternalLink size={11} />{linkText}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Live Trace Logs — always visible at bottom when engine tab */}
                {activeTab === 'engine' && (
                    <div className="card border-0 shadow-lg bg-dark rounded-4 overflow-hidden mt-4">
                        <div className="card-header border-0 bg-black bg-opacity-40 py-3 px-4 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="status-indicator-container">
                                        <div className={`status-indicator ${engineStatus === 'RUNNING' ? 'bg-success shadow-success' : 'bg-warning shadow-warning'}`}></div>
                                        <div className={`status-indicator-pulse ${engineStatus === 'RUNNING' ? 'bg-success' : 'bg-warning'}`}></div>
                                    </div>
                                    <span className="x-small fw-bold text-uppercase tracking-widest text-light ls-1">
                                        {engineStatus === 'RUNNING' ? 'PROXIMA_LIVE_FEED' : 'SEQUENCE_PAUSED'}
                                    </span>
                                </div>
                                <span className="text-muted opacity-25">|</span>
                                <span className="x-small fw-bold text-primary ls-1 text-uppercase">Execution Trace Logs</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    className="btn btn-outline-danger btn-sm rounded-pill px-3 x-small fw-bold d-flex align-items-center gap-2"
                                    onClick={handleClearLogs}
                                    disabled={clearing || !logs || logs.length === 0}
                                    style={{ backgroundColor: 'transparent' }}
                                >
                                    {clearing ? <span className="spinner-border spinner-border-sm" style={{ width: 10, height: 10 }}></span> : <Trash2 size={12} />} CLEAR
                                </button>
                                <div className="bg-white bg-opacity-10 rounded-pill px-3 py-1 x-small text-light font-monospace border border-white border-opacity-10 fw-bold">
                                    {(logs || []).length} ENTRIES
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-0 overflow-auto custom-scrollbar activity-terminal" style={{ maxHeight: '500px', minHeight: '300px' }}>
                            {(!logs || logs.length === 0) ? (
                                <div className="py-5 d-flex flex-column align-items-center justify-content-center text-center opacity-25">
                                    <Search size={48} className="text-light mb-3" />
                                    <h6 className="fw-bold ls-tight mb-2 text-light">ZERO TRACE RECORDED</h6>
                                </div>
                            ) : (
                                <div className="p-4 font-monospace">
                                    {logs.map((log, i) => (
                                        <div key={i} className="log-line d-flex gap-4 py-1 align-items-start transition-all">
                                            <span className="text-light opacity-25 flex-shrink-0 x-small pt-1 font-monospace" style={{ width: '85px' }}>
                                                [{formatTime(log.timestamp)}]
                                            </span>
                                            <span className={`flex-shrink-0 x-small pt-1 text-uppercase ls-1 ${getLevelColor(log.level, log.category)}`} style={{ width: '60px' }}>
                                                {log.level}
                                            </span>
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <span className={`${log.category === 'RAW' ? 'text-secondary' : 'text-primary'} x-small fw-bold opacity-75`}>
                                                        @{log.category}
                                                    </span>
                                                    <div className="flex-grow-1 border-top border-white border-opacity-05"></div>
                                                </div>
                                                <p className={`mb-2 small leading-relaxed ${log.category === 'RAW' ? 'text-secondary' : 'text-white'} opacity-90 text-break`}>
                                                    {log.message}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={logEndRef} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .ls-1 { letter-spacing: 0.5px; }
                .x-small { font-size: 0.75rem; }
                .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                .bg-success-subtle { background-color: rgba(25, 135, 84, 0.1); }
                .avatar-md { width: 48px; height: 48px; }
                .font-monospace { font-family: 'JetBrains Mono', 'Fira Code', 'SFMono-Regular', Consolas, monospace !important; }
                .tracking-widest { letter-spacing: 0.15em; }
                .status-indicator-container { position: relative; width: 12px; height: 12px; }
                .status-indicator { width: 8px; height: 8px; border-radius: 50%; position: absolute; z-index: 2; top: 2px; left: 2px; }
                .status-indicator-pulse { width: 12px; height: 12px; border-radius: 50%; position: absolute; opacity: 0.4; animation: pulse 2s infinite; }
                .shadow-success { box-shadow: 0 0 10px 0 rgba(25, 135, 84, 0.4); }
                .shadow-warning { box-shadow: 0 0 10px 0 rgba(255, 193, 7, 0.4); }
                @keyframes pulse { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(2.5); opacity: 0; } }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .log-line { border-left: 2px solid transparent; }
                .log-line:hover { border-left-color: rgba(255,255,255,0.05); }
                .leading-relaxed { line-height: 1.6; }
                .animate-spin { animation: spin 2s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .rounded-top-4 { border-top-left-radius: 1rem !important; border-top-right-radius: 1rem !important; }
            `}} />
        </AppLayout>
    );
}

export default Settings;
