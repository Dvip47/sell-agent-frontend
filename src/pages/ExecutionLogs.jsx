import { useState, useEffect, useRef } from 'react';
import {
    Terminal,
    Activity,
    Zap,
    Shield,
    CheckCircle2,
    Pause,
    Play,
    RefreshCw,
    Search,
    Trash2
} from 'lucide-react';
import AppLayout from '../components/Layout/AppLayout';
import Loader from '../components/Common/Loader';
import ErrorBox from '../components/Common/ErrorBox';
import { logsAPI } from '../api/logs.api';
import { executionAPI } from '../api/execution.api';
import ExecutionLogsSkeleton from '../components/ui/Skeleton/ExecutionLogsSkeleton';

function ExecutionLogs() {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [engineStatus, setEngineStatus] = useState(null);
    const [error, setError] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [clearing, setClearing] = useState(false);
    const logEndRef = useRef(null);

    useEffect(() => {
        initialLoad();
    }, []);

    useEffect(() => {
        let interval;
        if (autoRefresh) {
            interval = setInterval(pollLogs, 3000);
        }
        return () => clearInterval(interval);
    }, [autoRefresh, logs]);

    const initialLoad = async () => {
        setLoading(true);
        try {
            const [logsData, statusData] = await Promise.all([
                logsAPI.getLogs({ limit: 50 }),
                executionAPI.getStatus()
            ]);
            setLogs((logsData.logs || []).reverse());
            setEngineStatus(statusData.engineStatus);
        } catch (err) {
            setError('Failed to establish log stream connection.');
        } finally {
            setLoading(false);
        }
    };

    const pollLogs = async () => {
        try {
            const lastTimestamp = logs.length > 0 ? logs[logs.length - 1].timestamp : null;
            const logsData = await logsAPI.getLogs({ since: lastTimestamp, limit: 50 });

            if (logsData.logs && logsData.logs.length > 0) {
                const newLogs = logsData.logs.reverse();
                setLogs(prev => [...prev, ...newLogs]);
                logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (err) {
            console.error('Polling failed', err);
        }
    };

    const handleClearLogs = async () => {
        if (!window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) return;

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

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
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

    if (loading && logs.length === 0) return <AppLayout><ExecutionLogsSkeleton /></AppLayout>;
    if (error) return <AppLayout><ErrorBox error={error} onRetry={initialLoad} /></AppLayout>;

    return (
        <AppLayout>
            <div className="container-fluid py-4 px-4 overflow-hidden">
                {/* Header Section */}
                <div className="row mb-4 align-items-center">
                    <div className="col">
                        <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                            Neural Trace Logs
                        </h2>
                        <div className="d-flex align-items-center text-muted x-small fw-bold text-uppercase ls-1 gap-3">
                            <span className="d-flex align-items-center gap-1">
                                <Activity size={12} className="text-primary" />
                                Live authoritative trace of agent decisions
                            </span>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="bg-white border shadow-sm rounded-pill p-1 d-flex align-items-center gap-3">
                            <div className="form-check form-switch mb-0 ps-5 me-2">
                                <input
                                    className="form-check-input shadow-none cursor-pointer"
                                    type="checkbox"
                                    id="autoRefreshSwitch"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                />
                                <label className="form-check-label x-small fw-bold text-uppercase ls-1" htmlFor="autoRefreshSwitch">Auto-refresh</label>
                            </div>
                            <div className="d-flex gap-2 pe-1">
                                <button
                                    className="btn btn-outline-danger rounded-pill px-4 x-small fw-bold d-flex align-items-center gap-2"
                                    onClick={handleClearLogs}
                                    disabled={clearing || logs.length === 0}
                                >
                                    {clearing ? <span className="spinner-border spinner-border-sm"></span> : <Trash2 size={12} />} CLEAR
                                </button>
                                <button className="btn btn-dark rounded-pill px-4 x-small fw-bold d-flex align-items-center gap-2" onClick={initialLoad}>
                                    <RefreshCw size={12} /> SYNC
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Log Terminal */}
                <div className="card border-0 shadow-lg bg-dark rounded-4 overflow-hidden" style={{ minHeight: '700px' }}>
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
                            <span className="x-small fw-bold text-primary ls-1 text-uppercase">v2.4.0 Engine</span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-white bg-opacity-10 rounded-pill px-3 py-1 x-small text-light font-monospace border border-white border-opacity-10 fw-bold">
                                {logs.length} ENTRIES
                            </div>
                        </div>
                    </div>

                    <div className="card-body p-0 overflow-auto custom-scrollbar activity-terminal" style={{ height: '700px' }}>
                        {logs.length === 0 ? (
                            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center opacity-25">
                                <Search size={48} className="text-light mb-3" />
                                <h6 className="fw-bold ls-tight mb-2 text-light">ZERO TRACE RECORDED</h6>
                                <p className="small text-muted mb-0 mx-auto" style={{ maxWidth: '300px' }}>
                                    Engine has not initiated any tactical protocols in the current session.
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 font-monospace">
                                {logs.map((log, i) => (
                                    <div key={i} className={`log-line d-flex gap-4 py-1 align-items-start transition-all`}>
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

                    <div className="card-footer border-0 bg-black bg-opacity-40 py-2 px-4">
                        <div className="d-flex justify-content-between align-items-center x-small">
                            <div className="d-flex align-items-center gap-2 opacity-50">
                                <Shield size={10} className="text-primary" />
                                <span className="fw-bold ls-1 text-uppercase text-light">Authoritative Audit Trail</span>
                            </div>
                            <span className="opacity-40 font-monospace text-light">LOCAL_ADDR: 127.0.0.1</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .ls-tight { letter-spacing: -0.02em; }
                .ls-1 { letter-spacing: 0.05em; }
                .x-small { font-size: 0.72rem; }
                .font-monospace { font-family: 'JetBrains Mono', 'Fira Code', 'SFMono-Regular', Consolas, monospace !important; }
                .tracking-widest { letter-spacing: 0.15em; }
                
                .transition-all { transition: all 0.2s ease; }
                .cursor-pointer { cursor: pointer; }
                
                .status-indicator-container { position: relative; width: 12px; height: 12px; }
                .status-indicator { width: 8px; height: 8px; border-radius: 50%; position: absolute; z-index: 2; top: 2px; left: 2px; }
                .status-indicator-pulse { width: 12px; height: 12px; border-radius: 50%; position: absolute; opacity: 0.4; animation: pulse 2s infinite; }
                .shadow-success { box-shadow: 0 0 10px 0 rgba(25, 135, 84, 0.4); }
                .shadow-warning { box-shadow: 0 0 10px 0 rgba(255, 193, 7, 0.4); }
                
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.4; }
                    100% { transform: scale(2.5); opacity: 0; }
                }

                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                
                .log-line { border-left: 2px solid transparent; }
                .log-line:hover { border-left-color: rgba(255,255,255,0.05); }
                .leading-relaxed { line-height: 1.6; }
            `}</style>
        </AppLayout>
    );
}

export default ExecutionLogs;
