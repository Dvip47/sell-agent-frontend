import { useState, useEffect } from 'react';
import {
    Calendar,
    Video,
    Clock,
    User,
    Building,
    CheckCircle2,
    RefreshCw,
    Link as LinkIcon,
    AlertTriangle,
    Shield,
    BarChart3
} from 'lucide-react';
import AppLayout from '../components/Layout/AppLayout';
import Loader from '../components/Common/Loader';
import ErrorBox from '../components/Common/ErrorBox';
import NativeCalendar from '../components/Calendar/NativeCalendar';
import { MeetingsPageSkeleton } from '../components/ui/Skeleton';
import { meetingsAPI } from '../api/meetings.api';

function MeetingsPage() {
    const [loading, setLoading] = useState(true);
    const [allMeetings, setAllMeetings] = useState([]);
    const [status, setStatus] = useState({ connected: false, lastSyncAt: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [allData, statusData] = await Promise.all([
                meetingsAPI.getAll(),
                meetingsAPI.getStatus()
            ]);
            setAllMeetings(allData.meetings || []);
            setStatus(statusData);
        } catch (err) {
            setError('Failed to sync with calendar data. Please ensure your provider is connected.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <AppLayout><MeetingsPageSkeleton /></AppLayout>;

    return (
        <AppLayout>
            <div className="container-fluid py-4 px-4">
                {/* Header Area */}
                <div className="row mb-5 align-items-center">
                    <div className="col">
                        <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                            Operational Agenda
                        </h2>
                        <div className="d-flex align-items-center text-muted x-small fw-bold text-uppercase ls-1 gap-3">
                            <span className="d-flex align-items-center gap-1">
                                <Calendar size={12} className="text-primary" />
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-dark shadow-sm px-4 py-2 rounded-pill d-flex align-items-center gap-2 x-small fw-bold transition-all hover-translate-y" onClick={loadData}>
                            <RefreshCw size={14} className={loading ? 'spin' : ''} /> SYNC PROTOCOL
                        </button>
                    </div>
                </div>

                {/* Connection Status & Notices */}
                <div className="row mb-5">
                    <div className="col-12">
                        {!status.connected ? (
                            <div className="card border-0 shadow-sm rounded-4 bg-warning bg-opacity-10 border border-warning border-opacity-20 overflow-hidden">
                                <div className="card-body d-flex align-items-center p-4">
                                    <div className="bg-warning bg-opacity-20 p-3 rounded-4 text-warning me-4 shadow-sm">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold text-dark mb-1">Calendar Channel: Off-line</div>
                                        <div className="small text-muted fw-medium">SellAgent cannot sync real-time meeting status or dynamic booking links. Connect your Google Workspace or Outlook calendar.</div>
                                    </div>
                                    <button className="btn btn-dark rounded-pill px-4 py-2 x-small fw-bold shadow-sm transition-all hover-translate-y">
                                        AUTHORIZE CALENDAR
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card border-0 shadow-sm rounded-4 border-start border-4 border-success bg-white overflow-hidden">
                                <div className="card-body d-flex align-items-center p-3 px-4">
                                    <div className="bg-success bg-opacity-10 p-2 rounded-3 text-success me-3">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <div className="flex-grow-1">
                                        <span className="small text-muted fw-bold ls-1 text-uppercase me-2">Calendar Integrity:</span>
                                        <span className="small fw-bold text-dark">{status.lastSyncAt ? new Date(status.lastSyncAt).toLocaleTimeString() : 'Verified (Just now)'}</span>
                                    </div>
                                    <div className="status-indicator-container">
                                        <div className="status-indicator bg-success shadow-success"></div>
                                        <div className="status-indicator-pulse bg-success"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {error && <div className="mb-4"><ErrorBox error={error} /></div>}

                <div className="row g-4">
                    {/* Historical Planning - Right Column */}
                    <div className="col-lg-12">
                        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden h-100">
                            <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                    <BarChart3 size={20} className="text-primary" />
                                    <h5 className="fw-bold mb-0 text-dark">Neural Calendar Hub</h5>
                                </div>
                                <div className="small text-muted fw-bold ls-1 text-uppercase">Mapping Conversion Nodes</div>
                            </div>
                            <div className="card-body p-0">
                                <div className="p-4 border-bottom border-light bg-light bg-opacity-30">
                                    <div className="row g-3">
                                        <div className="col-auto">
                                            <div className="badge bg-white text-dark border shadow-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2 small fw-bold">
                                                <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div> Confirmed
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <div className="badge bg-white text-dark border shadow-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2 small fw-bold">
                                                <div className="bg-warning rounded-circle" style={{ width: '8px', height: '8px' }}></div> Tentative
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <NativeCalendar meetings={allMeetings} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .ls-1 { letter-spacing: 0.05em; }
                .x-small { font-size: 0.75rem; }
                .rounded-4 { border-radius: 1rem !important; }
                .transition-all { transition: all 0.2s ease-in-out; }
                .hover-translate-y:hover { transform: translateY(-2px); }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin { animation: spin 1s linear infinite; }
                
                .status-indicator-container { position: relative; width: 12px; height: 12px; }
                .status-indicator { width: 8px; height: 8px; border-radius: 50%; position: absolute; z-index: 2; top: 2px; left: 2px; }
                .status-indicator-pulse { width: 12px; height: 12px; border-radius: 50%; position: absolute; opacity: 0.4; animation: pulse 2s infinite; }
                .shadow-success { box-shadow: 0 0 10px 0 rgba(25, 135, 84, 0.4); }
                
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.4; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
            `}</style>
        </AppLayout>
    );
}

export default MeetingsPage;

