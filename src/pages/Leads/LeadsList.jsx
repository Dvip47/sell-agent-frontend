import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Search,
    Filter,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Building2,
    Mail,
    Calendar,
    RefreshCw,
    BarChart3,
    ArrowRight,
    Trash2,
    Ban,
    User,
    ChevronDown,
    LayoutGrid,
    ListFilter
} from 'lucide-react';
import { TableVirtuoso } from 'react-virtuoso';
import AppLayout from '../../components/Layout/AppLayout';
import Loader from '../../components/Common/Loader';
import ErrorBox from '../../components/Common/ErrorBox';
import StatusBadge from '../../components/Common/StatusBadge';
import { leadsAPI } from '../../api/leads.api';
import { productAPI } from '../../api/product.api';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import CallQueue from './CallQueue';
import LeadsPageSkeleton from '../../components/ui/Skeleton/LeadsPageSkeleton';

function LeadsList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'pipeline';

    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [leads, setLeads] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLeads, setTotalLeads] = useState(0);
    const virtuosoRef = useRef(null);

    const [showFilters, setShowFilters] = useState(false);

    // Filters & Search
    const [search, setSearch] = useState('');
    const [stateFilter, setStateFilter] = useState('CONTACTED');
    const [industryFilter, setIndustryFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState('updatedAt');
    const [sortOrder, setSortOrder] = useState('desc');

    const [selectedIds, setSelectedIds] = useState([]);
    const [actionLoading, setActionLoading] = useState(false);

    const loadLeads = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await leadsAPI.getLeads({
                page: 1,
                limit: 500, // Fetch 'all' at once
                search: search || undefined,
                state: stateFilter || undefined,
                industry: industryFilter || undefined,
                productId: productFilter || undefined,
                sortBy,
                sortOrder
            });

            setLeads(data.leads || []);
            setTotalLeads(data.total || 0);
            setTotalPages(data.pages || 1);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load leads');
        } finally {
            setLoading(false);
        }
    }, [search, stateFilter, industryFilter, productFilter, sortBy, sortOrder]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productAPI.getSetup();
                setProducts(data || []);
            } catch (err) {
                console.error('Failed to fetch products', err);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadLeads();
        }, 300);
        return () => clearTimeout(timer);
    }, [loadLeads]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const handleSelectLead = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(leads.map(l => l._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleMassDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} leads?`)) return;
        setActionLoading(true);
        try {
            await leadsAPI.bulkDelete(selectedIds);
            setLeads(prev => prev.filter(l => !selectedIds.includes(l._id)));
            setSelectedIds([]);
        } catch (err) {
            alert('Failed to delete leads');
        } finally {
            setActionLoading(false);
        }
    };

    const handleMassBlock = async () => {
        if (!window.confirm(`Are you sure you want to block ${selectedIds.length} leads?`)) return;
        setActionLoading(true);
        try {
            await leadsAPI.bulkBlock(selectedIds);
            setLeads(prev => prev.map(l =>
                selectedIds.includes(l._id) ? { ...l, state: 'STOPPED' } : l
            ));
            setSelectedIds([]);
        } catch (err) {
            alert('Failed to block leads');
        } finally {
            setActionLoading(false);
        }
    };

    const handleClearErrors = async () => {
        const errorLeads = leads.filter(l => l.state === 'ERROR');
        if (errorLeads.length === 0) {
            alert('No error leads to clear');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete all ${errorLeads.length} leads in ERROR state?`)) return;

        setActionLoading(true);
        try {
            await leadsAPI.deleteErrors();
            setLeads(prev => prev.filter(l => l.state !== 'ERROR'));
            // Also clean up selections if any of them were errors
            const errorIds = errorLeads.map(l => l._id);
            setSelectedIds(prev => prev.filter(id => !errorIds.includes(id)));
        } catch (err) {
            alert('Failed to clear error leads');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSingleDelete = async (id) => {
        if (!window.confirm('Delete this lead?')) return;
        try {
            await leadsAPI.bulkDelete([id]);
            setLeads(prev => prev.filter(l => l._id !== id));
            setSelectedIds(prev => prev.filter(i => i !== id));
        } catch (err) {
            alert('Failed to delete lead');
        }
    };

    const handleSingleBlock = async (id) => {
        if (!window.confirm('Block this lead?')) return;
        try {
            await leadsAPI.bulkBlock([id]);
            setLeads(prev => prev.map(l => l._id === id ? { ...l, state: 'STOPPED' } : l));
            setSelectedIds(prev => prev.filter(i => i !== id));
        } catch (err) {
            alert('Failed to block lead');
        }
    };

    const industries = ['Education', 'Healthcare', 'Logistics', 'Manufacturing'];
    const states = [
        'DISCOVERED', 'QUALIFIED', 'CONTACTED', 'RESPONDED',
        'MEETING_PROPOSED', 'MEETING_BOOKED', 'STOPPED', 'BOUNCED', 'ERROR'
    ];

    if (error) return <AppLayout><ErrorBox error={error} onRetry={() => loadLeads()} /></AppLayout>;
    if (loading && leads.length === 0) return <AppLayout><LeadsPageSkeleton /></AppLayout>;

    return (
        <AppLayout>
            <div className="leads-page-wrapper h-100 bg-light bg-opacity-10">
                <div className="container-fluid py-4 px-4 h-100 d-flex flex-column">

                    {/* Header: Modern Minimalist */}
                    <div className="d-flex align-items-center justify-content-between mb-4 flex-shrink-0">
                        <div>
                            <h2 className="fw-800 text-dark mb-1 tracking-tight ls-n1">Leads Intelligence</h2>
                            <p className="text-muted small fw-medium mb-0 d-flex align-items-center gap-2">
                                <span className="badge bg-primary bg-opacity-10 text-primary border-0 rounded-pill px-2 py-1 x-small fw-bold">{totalLeads} Total Prospects</span>
                                <span className="opacity-50">/</span>
                                <span className="x-small">Autonomous Pipeline Management</span>
                            </p>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <div className="tab-switcher p-1 bg-white border rounded-pill d-flex shadow-sm">
                                <button
                                    className={`btn btn-sm rounded-pill px-3 py-1 fw-bold transition-all x-small ${activeTab === 'pipeline' ? 'bg-dark text-white shadow-sm' : 'text-muted'}`}
                                    onClick={() => setActiveTab('pipeline')}
                                >
                                    <BarChart3 size={14} className="me-1" /> Pipeline
                                </button>
                                <button
                                    className={`btn btn-sm rounded-pill px-3 py-1 fw-bold transition-all x-small ${activeTab === 'calls' ? 'bg-dark text-white ' : 'text-muted'}`}
                                    onClick={() => setActiveTab('calls')}
                                >
                                    📞 Call Queue
                                </button>
                            </div>
                        </div>
                    </div>

                    {activeTab === 'pipeline' ? (
                        <>
                            {/* Toolbar: Search & Action Center */}
                            <div className="row g-3 mb-4 flex-shrink-0 align-items-center">
                                <div className="col-md-5">
                                    <div className="modern-search-box bg-white border rounded-4 shadow-sm p-1 d-flex align-items-center overflow-hidden">
                                        <div className="px-3 text-muted"> <Search size={18} /> </div>
                                        <input
                                            type="text"
                                            className="form-control border-0 shadow-none bg-transparent py-2 small fw-medium"
                                            placeholder="Search by company, person or email..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        {loading && (
                                            <div className="px-3">
                                                <div className="spinner-border spinner-border-sm text-primary" style={{ width: '14px', height: '14px' }}></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-7 d-flex justify-content-end gap-2">
                                    <button
                                        className={`btn btn-white border shadow-sm rounded-4 px-3 py-2 fw-bold x-small d-flex align-items-center gap-2 ${showFilters ? 'bg-light' : ''}`}
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <ListFilter size={16} /> Filters
                                    </button>

                                    {selectedIds.length > 0 && (
                                        <div className="action-pill bg-dark text-white rounded-pill px-3 py-1 d-flex align-items-center gap-3 shadow-lg animate-slide-up">
                                            <span className="x-small fw-bold">{selectedIds.length} Selected</span>
                                            <div className="vr bg-white opacity-25" style={{ height: '16px' }}></div>
                                            <button className="btn btn-link text-danger p-0 x-small fw-bold text-decoration-none" onClick={handleMassDelete}>Delete</button>
                                            <button className="btn btn-link text-warning p-0 x-small fw-bold text-decoration-none" onClick={handleMassBlock}>Block</button>
                                            <button className="btn btn-link text-white opacity-75 p-0 x-small fw-bold text-decoration-none" onClick={() => setSelectedIds([])}>Esc</button>
                                        </div>
                                    )}

                                    <button className="btn btn-dark shadow-sm rounded-4 px-4 py-2 fw-bold small transition-all hover-scale" onClick={() => loadLeads(true)}>
                                        <RefreshCw size={16} className={loading && leads.length === 0 ? 'spin' : ''} />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Filters Drawer */}
                            {showFilters && (
                                <div className="filters-container bg-white border rounded-4 p-4 shadow-sm mb-4 animate-slide-down">
                                    <div className="row g-4">
                                        <div className="col-md-4">
                                            <label className="form-label x-small fw-800 text-muted ls-1 text-uppercase">Target Industry</label>
                                            <select className="form-select border-0 bg-light rounded-3 shadow-none small fw-bold" value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
                                                <option value="">All Sectors</option>
                                                {industries.map(i => <option key={i} value={i}>{i}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label x-small fw-800 text-muted ls-1 text-uppercase">Process State</label>
                                            <select className="form-select border-0 bg-light rounded-3 shadow-none small fw-bold" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
                                                <option value="">Any Status</option>
                                                {states.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label x-small fw-800 text-muted ls-1 text-uppercase">Associated Product</label>
                                            <select className="form-select border-0 bg-light rounded-3 shadow-none small fw-bold" value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
                                                <option value="">All Campaigns</option>
                                                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Data Grid: Modern Virtualized Table */}
                            <div className="flex-grow-1 overflow-hidden bg-white border rounded-4 shadow-sm position-relative d-flex flex-column">
                                <TableVirtuoso
                                    ref={virtuosoRef}
                                    className="flex-grow-1 custom-scrollbar"
                                    data={leads}
                                    components={{
                                        Table: (props) => <table {...props} className="table modern-table table-hover align-middle mb-0" />,
                                        TableHead: (props) => <thead {...props} className="sticky-top bg-white border-bottom z-1" />,
                                        TableRow: (props) => <tr {...props} className="modern-tr" />,
                                    }}
                                    fixedHeaderContent={() => (
                                        <tr>
                                            <th className="px-4 py-3 border-0 text-muted x-small fw-bold text-uppercase ls-1" style={{ width: '60px' }}>#</th>
                                            <th className="px-4 py-3 border-0 text-muted x-small fw-800 text-uppercase ls-1" style={{ cursor: 'pointer', width: '30%' }} onClick={() => handleSort('company')}>
                                                Company / Organization <ChevronDown size={14} className="ms-1 opacity-50" />
                                            </th>
                                            <th className="px-4 py-3 border-0 text-muted x-small fw-800 text-uppercase ls-1" style={{ width: '15%' }}>Sector</th>
                                            <th className="px-4 py-3 border-0 text-muted x-small fw-800 text-uppercase ls-1" style={{ width: '15%' }}>Intelligence Status</th>
                                            <th className="px-4 py-3 border-0 text-muted x-small fw-800 text-uppercase ls-1 text-center" style={{ width: '10%' }} onClick={() => handleSort('intentScore')}>
                                                Intent <ArrowUpDown size={12} className="ms-1 opacity-50" />
                                            </th>
                                            <th className="px-4 py-3 border-0 text-muted x-small fw-800 text-uppercase ls-1 text-center" style={{ width: '10%' }} onClick={() => handleSort('updatedAt')}>
                                                Last Signal <ArrowUpDown size={12} className="ms-1 opacity-50" />
                                            </th>
                                            <th className="px-4 py-3 border-0 text-end text-muted x-small fw-800 text-uppercase ls-1 pe-4">Action Protocol</th>
                                        </tr>
                                    )}
                                    itemContent={(idx, lead) => (
                                        <>
                                            <td className="px-4 py-4" style={{ width: '60px' }}>
                                                <span className="text-muted x-small fw-800">{idx + 1}</span>
                                            </td>
                                            <td className="px-4 py-4" style={{ width: '30%' }}>
                                                <div className="d-flex align-items-center">
                                                    <div className="company-logo-initial me-3 bg-primary bg-opacity-10 text-primary border rounded-circle d-flex align-items-center justify-content-center fw-800">
                                                        {/* {lead.company?.[0]?.toUpperCase()} */}
                                                        <Building2 size={16} />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <Link to={`/leads/${lead._id}`} className="fw-bold text-dark text-decoration-none small hover-primary d-block text-truncate mb-1">
                                                            {lead.company?.length > 50 ? `${lead.company.substring(0, 50)}...` : lead.company}
                                                        </Link>
                                                        <div className="text-muted x-small d-flex align-items-center gap-1">
                                                            <User size={10} className="opacity-50" /> {lead.contactName || 'Unidentified Point'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4" style={{ width: '15%' }}>
                                                <span className="badge-modern grey x-small">{lead.industry && lead.industry !== 'undefined' ? lead.industry : 'General Business'}</span>
                                            </td>
                                            <td className="px-4 py-4" style={{ width: '15%' }}>
                                                <StatusBadge state={lead.state} />
                                            </td>
                                            <td className="px-4 py-4" style={{ width: '10%' }}>
                                                <div className="d-flex flex-column align-items-center gap-1">
                                                    <span className={`fw-800 small ${lead.intentScore >= 70 ? 'text-success' : lead.intentScore >= 40 ? 'text-primary' : 'text-danger'}`}>{lead.intentScore}%</span>
                                                    <div className="progress w-100" style={{ height: '4px', maxWidth: '60px', backgroundColor: '#f0f0f0' }}>
                                                        <div className="progress-bar rounded-pill" style={{ width: `${lead.intentScore}%`, backgroundColor: lead.intentScore >= 70 ? '#198754' : lead.intentScore >= 40 ? '#0d6efd' : '#dc3545' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4" style={{ width: '10%' }}>
                                                <div className="text-center">
                                                    <div className="text-dark x-small fw-bold mb-0">{formatDate(lead.updatedAt)}</div>
                                                    <div className="text-muted" style={{ fontSize: '9px', opacity: 0.6 }}>{lead.source}</div>
                                                </div>
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
                                                        className="btn btn-danger border mt-2 rounded-3 px-2 py-1 x-small fw-bold text-muted transition-all"
                                                        style={{ width: '36px', height: '36px', padding: 0 }}
                                                        title="Delete" onClick={() => handleSingleDelete(lead._id)}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                />
                                {leads.length === 0 && !loading && (
                                    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center py-5">
                                        <div className="py-5 opacity-25 text-center">
                                            <LayoutGrid size={64} className="mb-3" />
                                            <h5 className="fw-bold">No High-Signal Leads</h5>
                                            <p className="small">The pipeline is waiting for neural harvest signals.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow-1 overflow-auto rounded-4 bg-white border shadow-sm">
                            <CallQueue />
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                
                .leads-page-wrapper {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background-color: #f8f9fa;
                }

                .fw-800 { font-weight: 800; }
                .tracking-tight { letter-spacing: -0.02em; }
                .ls-n1 { letter-spacing: -0.03em; }
                .ls-1 { letter-spacing: 0.05em; }
                .x-small { font-size: 0.72rem; }
                
                .hover-scale:hover { transform: scale(1.05); }
                .hover-primary:hover { color: #0d6efd !important; }
                
                .company-logo-initial {
                    width: 36px;
                    height: 36px;
                    font-size: 14px;
                }

                .badge-modern {
                    padding: 4px 10px;
                    border-radius: 100px;
                    font-weight: 700;
                    text-transform: uppercase;
                    border: 1px solid transparent;
                }
                .badge-modern.grey { background: #f0f0f0; color: #666; font-size: 10px; }

                .btn-modern-action {
                    width: 32px;
                    height: 32px;
                    border-radius: 10px;
                    display: flex;
                    align-items-center;
                    justify-content: center;
                    border: 1px solid #eee;
                    background: white;
                    color: #333;
                    transition: all 0.2s;
                }
                .btn-modern-action:hover {
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                    transform: translateY(-2px);
                }
                .btn-modern-action.primary:hover { border-color: #0d6efd; color: #0d6efd; }
                .btn-modern-action.danger:hover { border-color: #dc3545; color: #dc3545; }

                .modern-tr {
                    transition: all 0.2s;
                    border-bottom: 1px solid #f0f0f0 !important;
                }
                .modern-tr:hover {
                    background: #fbfbfb !important;
                }

                .modern-search-box {
                    transition: all 0.3s;
                }
                .modern-search-box:focus-within {
                    border-color: #0d6efd !important;
                    box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1) !important;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) translateX(-50%); }
                    to { opacity: 1; transform: translateY(0) translateX(-50%); }
                }
                .action-pill {
                    position: fixed;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1000;
                }

                .skeleton-pulse {
                    background: linear-gradient(-90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%);
                    background-size: 400% 400%;
                    animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes pulse {
                    0% { background-position: 0% 0%; }
                    100% { background-position: -135% 0%; }
                }

                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: white; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ddd; }
            `}</style>
        </AppLayout>
    );
}

export default LeadsList;
