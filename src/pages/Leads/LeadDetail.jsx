import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Building2,
    Globe,
    Mail,
    Zap,
    Shield,
    Activity,
    Clock,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    Search,
    Bot,
    ArrowRight
} from 'lucide-react';
import AppLayout from '../../components/Layout/AppLayout';
import Loader from '../../components/Common/Loader';
import ErrorBox from '../../components/Common/ErrorBox';
import StatusBadge from '../../components/Common/StatusBadge';
import { leadsAPI } from '../../api/leads.api';
import { formatDate, formatDateTime } from '../../utils/formatters';
import LeadDetailSkeleton from '../../components/ui/Skeleton/LeadDetailSkeleton';

function LeadDetail() {
    const { leadId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lead, setLead] = useState(null);

    useEffect(() => {
        loadLead();
    }, [leadId]);

    const loadLead = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await leadsAPI.getLead(leadId);
            setLead(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load lead details');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !lead) return <AppLayout><LeadDetailSkeleton /></AppLayout>;
    if (error) return <AppLayout><ErrorBox error={error} onRetry={loadLead} /></AppLayout>;
    if (!lead) return <AppLayout><ErrorBox error="Lead not found" /></AppLayout>;

    const EventIcon = ({ type }) => {
        switch (type) {
            case 'DISCOVERED': return <Search size={14} />;
            case 'QUALIFIED': return <Zap size={14} />;
            case 'CONTACTED': return <MessageSquare size={14} />;
            case 'REPLIED': return <Activity size={14} />;
            default: return <Activity size={14} />;
        }
    };

    return (
        <AppLayout>
            <div className="container-fluid py-4 px-4 overflow-hidden">
                {/* Header Section */}
                <div className="row mb-5 align-items-center">
                    <div className="col d-flex align-items-center gap-4">
                        <button
                            className="btn btn-white border shadow-sm rounded-circle d-flex align-items-center justify-content-center p-2 transition-all hover-translate-x"
                            onClick={() => navigate('/leads')}
                            style={{ width: '40px', height: '40px' }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-dark text-white p-3 rounded-4 shadow-sm">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h2 className="fw-bold text-dark mb-0 ls-tight">{lead.company}</h2>
                                <div className="d-flex align-items-center gap-3 mt-1">
                                    <span className="text-muted x-small d-flex align-items-center gap-1 fw-bold text-uppercase ls-1">
                                        <Mail size={12} /> {lead.contactEmail}
                                    </span>
                                    <span className="text-muted opacity-50">|</span>
                                    <span className="text-muted x-small d-flex align-items-center gap-1 fw-bold text-uppercase ls-1">
                                        <Globe size={12} /> {lead.website || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <StatusBadge state={lead.state} />
                    </div>
                </div>

                <div className="row g-4 pt-2">
                    {/* Left Sidebar: Intelligence Panel */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                                        <Shield size={18} />
                                    </div>
                                    <h6 className="fw-bold mb-0 text-uppercase ls-1 small">Qualification Profile</h6>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-end mb-2">
                                        <label className="text-muted x-small fw-bold text-uppercase ls-1">Intelligence Confidence</label>
                                        <span className="h5 fw-bold text-dark mb-0">
                                            {lead.aiRelevance?.confidence != null
                                                ? `${(lead.aiRelevance.confidence * 100).toFixed(0)}%`
                                                : '—'}
                                        </span>
                                    </div>
                                    <div className="bg-light rounded-pill overflow-hidden" style={{ height: '8px' }}>
                                        <div
                                            className="h-100 bg-primary rounded-pill transition-all"
                                            style={{ width: `${lead.aiRelevance?.confidence != null ? lead.aiRelevance.confidence * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-light bg-opacity-50 p-3 rounded-4 border border-light">
                                        <label className="text-muted x-small fw-bold text-uppercase ls-1 d-block mb-1">Sector Analysis</label>
                                        <span className="small fw-bold text-dark">{lead.industry || 'General Business'}</span>
                                    </div>

                                    <div className="bg-light bg-opacity-50 p-3 rounded-4 border border-light mt-3">
                                        <label className="text-muted x-small fw-bold text-uppercase ls-1 d-block mb-2">Relevance Determination</label>
                                        <p className="small text-dark mb-0 fw-medium lh-base">
                                            {lead.aiRelevance?.reason || 'Agent currently processing intent signals.'}
                                        </p>
                                    </div>

                                    <div className="bg-light bg-opacity-50 p-3 rounded-4 border border-light mt-3">
                                        <label className="text-muted x-small fw-bold text-uppercase ls-1 d-block mb-2">Persona Logic</label>
                                        <p className="small text-muted mb-0 italic lh-base font-serif">
                                            "{lead.qualificationReasoning || 'Establishing persona alignment...'}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <div className="p-2 rounded-3 bg-dark bg-opacity-10 text-dark">
                                        <Bot size={18} />
                                    </div>
                                    <h6 className="fw-bold mb-0 text-uppercase ls-1 small">Agent Context</h6>
                                </div>

                                <div className="row g-3">
                                    <div className="col-6">
                                        <div className="border border-light p-3 rounded-4 text-center">
                                            <div className="text-muted x-small fw-bold mb-1">FOLLOW-UPS</div>
                                            <div className="h4 fw-bold text-dark mb-0">{lead.followUpCount || 0}<span className="text-muted h6 mb-0">/3</span></div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="border border-light p-3 rounded-4 text-center">
                                            <div className="text-muted x-small fw-bold mb-1">INTENT</div>
                                            <div className="h4 fw-bold text-success mb-0">{lead.intentScore || 0}%</div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="bg-dark text-white p-3 rounded-4 d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-2">
                                                <Clock size={14} className="opacity-50" />
                                                <span className="x-small fw-bold ls-1">LAST SYNC</span>
                                            </div>
                                            <span className="x-small fw-bold font-monospace">{formatDateTime(lead.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Execution Timeline */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 bg-white h-100 overflow-hidden">
                            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <Activity size={20} className="text-primary" />
                                    <h5 className="fw-bold mb-0 text-dark">Execution Timeline</h5>
                                </div>
                                <p className="text-muted small mb-3">Live sequence of agent-orchestrated maneuvers</p>
                            </div>
                            <div className="card-body px-4 pt-3 overflow-auto custom-scrollbar" style={{ maxHeight: '720px' }}>
                                <div className="timeline-v2">
                                    {lead.history && lead.history.length > 0 ? (
                                        lead.history.slice().reverse().map((event, index) => (
                                            <div key={index} className="timeline-item-container pb-5">
                                                <div className="timeline-line"></div>
                                                <div className="d-flex gap-4">
                                                    <div className="timeline-marker-container">
                                                        <div className={`timeline-marker shadow-sm ${event.meta?.simulated ? 'bg-warning' : 'bg-dark'}`}>
                                                            <div className="text-white">
                                                                <EventIcon type={event.type} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-baseline mb-2">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <span className="fw-bold text-dark small text-uppercase ls-1">
                                                                    {event.type.replace(/_/g, ' ')}
                                                                </span>
                                                                {event.meta?.simulated && (
                                                                    <span className="badge bg-warning bg-opacity-10 text-warning px-2 py-1 x-small fw-bold border border-warning border-opacity-20">TEST FLIGHT</span>
                                                                )}
                                                            </div>
                                                            <span className="text-muted x-small fw-bold font-monospace">
                                                                {formatDateTime(event.timestamp)}
                                                            </span>
                                                        </div>
                                                        <div className="bg-light bg-opacity-50 p-4 rounded-4 border border-light position-relative">
                                                            <p className="mb-0 small text-dark fw-medium lh-base text-break" style={{ whiteSpace: 'pre-wrap' }}>
                                                                {event.content}
                                                            </p>
                                                            {event.meta?.reason && (
                                                                <div className="mt-3 pt-3 border-top border-dark border-opacity-05">
                                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                                        <Bot size={12} className="text-primary" />
                                                                        <span className="x-small fw-bold text-uppercase ls-1 text-primary">Neural Reasoning</span>
                                                                    </div>
                                                                    <p className="mb-0 italic small text-muted font-serif">"{event.meta.reason}"</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-5">
                                            <div className="bg-light p-4 rounded-circle d-inline-block mb-3">
                                                <Activity size={40} className="text-muted opacity-20" />
                                            </div>
                                            <p className="text-muted small fw-bold">NO EXECUTION PROTOCOLS DETECTED</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .ls-tight { letter-spacing: -0.02em; }
                .ls-1 { letter-spacing: 0.05em; }
                .x-small { font-size: 0.7rem; }
                .font-serif { font-family: Georgia, serif; font-style: italic; }
                .font-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; }
                
                .transition-all { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
                .hover-translate-x:hover { transform: translateX(-3px); }
                .hover-bg-dark:hover { background: #000 !important; }
                
                .timeline-v2 { position: relative; padding-left: 0; }
                .timeline-item-container { position: relative; }
                .timeline-line { 
                    position: absolute; 
                    left: 20px; 
                    top: 40px; 
                    bottom: 0; 
                    width: 2px; 
                    background: linear-gradient(180deg, rgba(30, 41, 59, 0.1) 0%, rgba(30, 41, 59, 0) 100%);
                }
                .timeline-item-container:last-child .timeline-line { display: none; }
                
                .timeline-marker-container { width: 40px; height: 40px; position: relative; z-index: 2; flex-shrink: 0; }
                .timeline-marker { 
                    width: 40px; 
                    height: 40px; 
                    border-radius: 12px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                }
                
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
                .card { transition: box-shadow 0.3s ease; }
                .card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.05) !important; }
            `}</style>
        </AppLayout>
    );
}

export default LeadDetail;

