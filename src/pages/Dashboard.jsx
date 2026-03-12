import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Activity,
    Users,
    MessageSquare,
    CalendarCheck,
    CreditCard,
    Zap,
    ArrowUpRight,
    Play,
    Pause,
    Shield,
    Bot,
    Clock,
    CheckCircle2,
    AlertCircle,
    Building2,
    Eye,
    ArrowRight,
    Terminal,
    BarChart3
} from 'lucide-react';
import AppLayout from '../components/Layout/AppLayout';
import Loader from '../components/Common/Loader';
import ErrorBox from '../components/Common/ErrorBox';
import StatusBadge from '../components/Common/StatusBadge';
import { dashboardAPI } from '../api/dashboard.api';
import { executionAPI } from '../api/execution.api';
import { formatNumber, formatDate } from '../utils/formatters';
import DashboardSkeleton from '../components/ui/Skeleton/DashboardSkeleton';

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await dashboardAPI.getSummary();
            setSummary(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action) => {
        setSyncing(true);
        try {
            if (action === 'pause') await executionAPI.pause();
            else await executionAPI.resume();

            // Refresh summary to reflect new state
            const data = await dashboardAPI.getSummary();
            setSummary(data);
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${action} agent`);
        } finally {
            setSyncing(false);
        }
    };

    if (loading && !summary) return <AppLayout><DashboardSkeleton /></AppLayout>;
    if (error) return <AppLayout><ErrorBox error={error} onRetry={loadDashboard} /></AppLayout>;

    const MetricCard = ({ title, value, icon: Icon, color, subValue, trend }) => (
        <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden card-metric transition-all">
            <div className={`position-absolute top-0 end-0 p-4 opacity-05`}>
                <Icon size={80} />
            </div>
            <div className="card-body p-4 position-relative">
                <div className="d-flex align-items-center gap-2 mb-3">
                    <div className={`p-2 rounded-3 bg-opacity-10 bg-${color} text-${color}`}>
                        <Icon size={18} />
                    </div>
                    <span className="text-muted small fw-bold text-uppercase ls-1">{title}</span>
                </div>
                <div className="d-flex align-items-baseline gap-2">
                    <h2 className="fw-bold mb-0 display-6 ls-tight">{formatNumber(value)}</h2>
                    {trend && <span className="badge bg-success bg-opacity-10 text-success rounded-pill x-small fw-bold">+{trend}%</span>}
                </div>
                {subValue && <div className="text-muted x-small mt-2 fw-medium d-flex align-items-center gap-1">
                    <ArrowRight size={10} /> {subValue}
                </div>}
            </div>
        </div>
    );

    return (
        <AppLayout>
            <div className="container-fluid py-4 px-4">
                {/* Header Section */}
                <div className="row mb-5 align-items-center">
                    <div className="col">
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <div className="status-indicator-container">
                                <div className={`status-indicator ${summary?.executionStatus === 'RUNNING' ? 'bg-success shadow-success' : 'bg-warning shadow-warning'}`}></div>
                                <div className={`status-indicator-pulse ${summary?.executionStatus === 'RUNNING' ? 'bg-success' : 'bg-warning'}`}></div>
                            </div>
                            <h2 className="fw-bold text-dark mb-0 ls-tight">Command Center</h2>
                        </div>
                        <div className="d-flex align-items-center text-muted x-small fw-bold text-uppercase ls-1 gap-3">
                            <span className="d-flex align-items-center gap-1"><Clock size={12} /> Sync: Real-time</span>
                            <span className="text-primary opacity-50">|</span>
                            <span>Region: India (Global Edge)</span>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="d-flex align-items-center gap-3">
                            {/* Execution Controls */}
                            <div className="d-flex gap-2 me-2">
                                {summary?.executionStatus === 'RUNNING' ? (
                                    <button
                                        className="btn btn-warning rounded-pill px-4 py-2 small fw-bold d-flex align-items-center gap-2 shadow-warning-glow border-0 transition-all hover-elevate glass-btn-warning"
                                        onClick={() => handleAction('pause')}
                                        disabled={syncing}
                                        style={{ fontSize: '11px', letterSpacing: '0.05em' }}
                                    >
                                        {syncing ? <span className="spinner-border spinner-border-sm"></span> : <Pause size={14} fill="currentColor" />} PAUSE ENGINE
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-success rounded-pill px-4 py-2 small fw-bold d-flex align-items-center gap-2 shadow-success-glow border-0 transition-all hover-elevate glass-btn-success"
                                        onClick={() => handleAction('resume')}
                                        disabled={syncing}
                                        style={{ fontSize: '11px', letterSpacing: '0.05em' }}
                                    >
                                        {syncing ? <span className="spinner-border spinner-border-sm"></span> : <Play size={14} fill="currentColor" />} RESUME ENGINE
                                    </button>
                                )}
                            </div>

                            <div className="glass-card border-light d-flex align-items-center px-4 py-2 shadow-sm rounded-4">
                                <Shield size={16} className={`${summary?.executionStatus === 'RUNNING' ? 'text-success' : 'text-warning'} me-2`} />
                                <div className="text-start">
                                    <div className="x-small text-muted text-uppercase fw-bold ls-1" style={{ fontSize: '10px' }}>Engine</div>
                                    <div className="small fw-bold text-dark">{summary?.executionStatus}</div>
                                </div>
                            </div>
                            <div className="glass-card border-light d-flex align-items-center px-4 py-2 shadow-sm rounded-4 d-none d-md-flex">
                                <Bot size={16} className="text-primary me-2" />
                                <div className="text-start">
                                    <div className="x-small text-muted text-uppercase fw-bold ls-1" style={{ fontSize: '10px' }}>Active Products</div>
                                    <div className="small fw-bold text-dark">{summary?.agents?.length || 0} Ready</div>
                                </div>
                            </div>
                            {summary?.agents?.length > 0 && (
                                <div className="glass-card border-light d-flex align-items-center px-4 py-2 shadow-sm rounded-4 d-none d-lg-flex">
                                    <div className="text-start">
                                        <div className="x-small text-muted text-uppercase fw-bold ls-1" style={{ fontSize: '10px' }}>Primary Architecture</div>
                                        <div className="small fw-bold text-dark">{summary.agents[0].model || 'Gemini 1.5 Flash'}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Performance Banner */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm overflow-hidden rounded-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                            <div className="card-body py-4 px-4 position-relative">
                                <div className="position-absolute top-0 end-0 h-100 opacity-05">
                                    <Activity size={200} className="text-white" style={{ transform: 'translate(40%, -20%)' }} />
                                </div>
                                <div className="row align-items-center position-relative">
                                    <div className="col">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-primary p-3 rounded-4 shadow-primary">
                                                <Zap size={24} className="text-white fill-white" />
                                            </div>
                                            <div>
                                                <h5 className="text-white fw-bold mb-1">Operational Velocity: Optima</h5>
                                                <p className="text-white-50 small mb-0 fw-medium">
                                                    Agent processed <span className="text-white fw-bold">{summary?.emailsSentToday}</span> high-intent intelligence sequences in the last 24 hours.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {summary?.successRate !== null && summary?.successRate !== undefined && (
                                        <div className="col-auto">
                                            <div className="text-end">
                                                <div className="text-white-50 x-small text-uppercase fw-bold ls-1 mb-1">Performance Index</div>
                                                <div className="h4 fw-bold text-success mb-0">{summary.successRate}%</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-md-3">
                        <MetricCard title="Intelligence Core" value={summary?.activeLeads} icon={Users} color="primary" subValue="Prospects Identified" />
                    </div>
                    <div className="col-md-3">
                        <MetricCard title="Signal Response" value={summary?.repliesReceived} icon={MessageSquare} color="info" subValue="Positive Interactions" />
                    </div>
                    <div className="col-md-3">
                        <MetricCard title="Conversion Node" value={summary?.meetingsBooked} icon={CalendarCheck} color="success" subValue="High-Value Meetings" />
                    </div>
                    <div className="col-md-3">
                        <MetricCard title="Neural Credits" value={summary?.creditsRemaining} icon={CreditCard} color="warning" subValue="Intelligence Assets" />
                    </div>
                </div>

                <div className="row g-4">
                    {/* Recent Leads */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm h-100 rounded-4 bg-white overflow-hidden">
                            <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                    <BarChart3 size={20} className="text-primary" />
                                    <h5 className="fw-bold mb-0">Prospect Harvest Feed</h5>
                                </div>
                                <Link to="/leads" className="btn btn-link text-decoration-none x-small fw-bold text-primary p-0 d-flex align-items-center gap-1">
                                    FULL PIPELINE <ArrowUpRight size={14} />
                                </Link>
                            </div>
                            <div className="card-body px-0 pt-3">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light bg-opacity-50">
                                            <tr>
                                                <th className="px-4 py-3 border-0 x-small text-muted text-uppercase ls-1">Company</th>
                                                <th className="px-4 py-3 border-0 x-small text-muted text-uppercase ls-1">Sector</th>
                                                <th className="px-4 py-3 border-0 x-small text-muted text-uppercase ls-1">Intelligence</th>
                                                <th className="px-4 py-3 border-0 text-end x-small text-muted text-uppercase ls-1 pe-4">Protocol</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {summary?.recentLeads?.length === 0 ? (
                                                <tr><td colSpan="4" className="text-center py-5 text-muted small">Awaiting harvest initialization...</td></tr>
                                            ) : (
                                                summary?.recentLeads?.map(lead => (
                                                    <tr key={lead._id} className="transition-all hover-elevate">
                                                        <td className="px-4 py-3">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div className="bg-light p-2 rounded-3 text-dark">
                                                                    <Building2 size={16} />
                                                                </div>
                                                                <div>
                                                                    <div className="fw-bold text-dark small">{lead.company}</div>
                                                                    <div className="text-muted x-small">{lead.contactEmail}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 x-small text-muted fw-bold">
                                                            <span className="px-2 py-1 rounded-pill bg-light border">{lead.industry}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <StatusBadge state={lead.state} />
                                                        </td>
                                                        <td className="px-4 py-3 text-end pe-4">
                                                            <Link to={`/leads/${lead._id}`} className="btn btn-sm btn-outline-dark rounded-pill px-3 py-1 x-small fw-bold transition-all hover-bg-dark hover-text-white">
                                                                Inspect
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
                    </div>

                    {/* Activity Feed */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm h-100 rounded-4 bg-dark text-white overflow-hidden">
                            <div className="card-header bg-transparent border-0 pt-4 px-4">
                                <div className="d-flex align-items-center gap-2">
                                    <Terminal size={20} className="text-success" />
                                    <h5 className="fw-bold mb-0 text-white">Execution Stream</h5>
                                </div>
                            </div>
                            <div className="card-body px-4 pt-3 activity-terminal">
                                <div className="activity-feed">
                                    {summary?.recentLogs?.length === 0 ? (
                                        <div className="text-center py-5 text-white-50 x-small fw-bold ls-1 opacity-50 font-monospace">AWAITING SYSTEM BOOT...</div>
                                    ) : (
                                        summary?.recentLogs?.map((log, idx) => (
                                            <div key={idx} className="d-flex mb-4 gap-3">
                                                <div className="log-line-indicator">
                                                    <div className={`log-dot ${log.level === 'ERROR' ? 'bg-danger shadow-danger' : log.level === 'WARNING' ? 'bg-warning shadow-warning' : 'bg-success shadow-success'}`}></div>
                                                </div>
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <span className={`x-small fw-bold text-uppercase font-monospace ${log.level === 'ERROR' ? 'text-danger' : log.level === 'WARNING' ? 'text-warning' : 'text-success'}`}>{log.category}</span>
                                                        <span className="x-small text-white-50 font-monospace" style={{ fontSize: '10px' }}>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                                    </div>
                                                    <p className="small text-white-50 mb-0 ls-tight font-monospace overflow-hidden text-break">{log.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="pt-3 border-top border-white border-opacity-10 mt-2">
                                    <Link to="/logs" className="btn btn-outline-light w-100 x-small fw-bold py-2 rounded-3 opacity-75 hover-opacity-100 d-flex align-items-center justify-content-center gap-2">
                                        <Activity size={12} /> ENTER DEBUG LOGS
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .display-6 { font-size: 2rem; font-weight: 800; }
                .ls-tight { letter-spacing: -0.02em; }
                .ls-1 { letter-spacing: 0.05em; }
                .x-small { font-size: 0.7rem; }
                .opacity-05 { opacity: 0.05; }
                .rounded-4 { border-radius: 1rem !important; }
                .shadow-primary { box-shadow: 0 10px 20px -5px rgba(13, 110, 253, 0.4); }
                .shadow-success { box-shadow: 0 0 10px 0 rgba(25, 135, 84, 0.4); }
                .shadow-warning { box-shadow: 0 0 10px 0 rgba(255, 193, 7, 0.4); }
                .shadow-danger { box-shadow: 0 0 10px 0 rgba(220, 53, 69, 0.4); }
                
                .shadow-success-glow { box-shadow: 0 8px 20px -5px rgba(25, 135, 84, 0.5); }
                .shadow-warning-glow { box-shadow: 0 8px 20px -5px rgba(255, 193, 7, 0.5); }
                
                .glass-btn-success { background: rgba(25, 135, 84, 0.9) !important; color: white !important; backdrop-filter: blur(4px); }
                .glass-btn-success:hover { background: rgba(25, 135, 84, 1) !important; box-shadow: 0 10px 25px -5px rgba(25, 135, 84, 0.6) !important; }
                .glass-btn-success:active { transform: translateY(0) scale(0.98) !important; }

                .glass-btn-warning { background: rgba(255, 193, 7, 0.9) !important; color: #333 !important; backdrop-filter: blur(4px); }
                .glass-btn-warning:hover { background: rgba(255, 193, 7, 1) !important; box-shadow: 0 10px 25px -5px rgba(255, 193, 7, 0.6) !important; }
                .glass-btn-warning:active { transform: translateY(0) scale(0.98) !important; }
                
                .transition-all { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
                .hover-elevate:hover { transform: translateY(-2px); }
                .card-metric:hover { transform: translateY(-4px); box-shadow: 0 15px 30px -10px rgba(0,0,0,0.1) !important; }
                
                .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); }
                .status-indicator-container { position: relative; width: 12px; height: 12px; }
                .status-indicator { width: 8px; height: 8px; border-radius: 50%; position: absolute; z-index: 2; top: 2px; left: 2px; }
                .status-indicator-pulse { width: 12px; height: 12px; border-radius: 50%; position: absolute; opacity: 0.4; animation: pulse 2s infinite; }
                
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.4; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                
                .activity-terminal {
                    background: #000;
                    margin: 2px;
                    border-radius: 0 0 0.9rem 0.9rem;
                    max-height: 500px;
                    overflow-y: auto;
                }
                .log-line-indicator { width: 2px; position: relative; }
                .log-dot { width: 6px; height: 6px; border-radius: 50%; position: absolute; left: -2px; top: 6px; }
                .activity-feed { position: relative; padding-left: 2px; }
                
                .font-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important; }
                
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
        </AppLayout>
    );
}

export default Dashboard;

