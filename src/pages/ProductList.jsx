import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Settings,
    CheckCircle2,
    Box,
    ArrowRight,
    ShieldCheck,
    AlertCircle,
    Rocket,
    Brain,
    Layers,
    Cpu,
    Zap,
    Info,
    Trash2
} from 'lucide-react';
import AppLayout from '../components/Layout/AppLayout';
import Loader from '../components/Common/Loader';
import ErrorBox from '../components/Common/ErrorBox';
import { productAPI } from '../api/product.api';
import { executionAPI } from '../api/execution.api';
import { ProductListSkeleton } from '../components/ui/Skeleton';

function ProductList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [activeProductIds, setActiveProductIds] = useState([]);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [productsData, statusData] = await Promise.all([
                productAPI.getSetup(),
                executionAPI.getOperationalStatus()
            ]);
            setProducts(Array.isArray(productsData) ? productsData : [productsData]);

            // Map active agents to their product IDs
            const activeIds = (statusData.activeAgents || []).map(a =>
                (a.productId?.id || a.productId)?.toString()
            );
            setActiveProductIds(activeIds);
        } catch (err) {
            setError('Failed to load your product intelligence portfolio.');
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async (productId) => {
        try {
            await productAPI.activate(productId);
            setActiveProductIds(prev => [...new Set([...prev, productId.toString()])]);
            navigate(`/setup/${productId}`);
        } catch (err) {
            setError('Failed to deploy this product as the primary agent.');
        }
    };

    const handleCreateNew = async () => {
        try {
            const newProduct = await productAPI.saveSetup({
                name: 'New Intelligence Unit',
                marketMotion: {
                    productType: 'OTHER',
                    salesMotion: 'OUTBOUND_LED',
                    typicalDealMotion: 'DEMO_DRIVEN'
                }
            });
            navigate(`/setup/${newProduct._id}`);
        } catch (err) {
            setError('Failed to initialize new product unit.');
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await productAPI.delete(deleteId);
            setProducts(products.filter(p => p._id !== deleteId));
            setDeleteId(null);
            // window.alert("Product deleted successfully");

        } catch (err) {
            setError('Failed to remove this product unit.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading && products.length === 0) return <AppLayout><ProductListSkeleton /></AppLayout>;
    if (loading) return <AppLayout><Loader text="Syncing product portfolio..." /></AppLayout>;

    return (
        <AppLayout>
            <div className="product-portfolio-page min-vh-100 py-5">
                <div className="container px-4">
                    {/* Header Section */}
                    <div className="row mb-5 align-items-center animate__animated animate__fadeIn">
                        <div className="col">
                            <div className="d-flex align-items-center gap-3 mb-2">
                                <div className="p-2 bg-primary bg-opacity-10 rounded-3 text-primary">
                                    <Brain size={24} />
                                </div>
                                <h2 className="fw-bold text-dark mb-0 ls-tight">Intelligence Portfolio</h2>
                            </div>
                            <p className="text-muted mb-0 opacity-75">Manage and deploy autonomous business units for your sales network.</p>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-dark d-flex align-items-center gap-2 px-4 py-2 shadow-lg rounded-pill hover-scale transition-all" onClick={handleCreateNew}>
                                <Plus size={18} /> New Product Unit
                            </button>
                        </div>
                    </div>

                    {error && <div className="mb-4 animate__animated animate__shakeX"><ErrorBox error={error} onRetry={loadData} /></div>}

                    {/* Grid Section */}
                    <div className="row g-4">
                        {products.length === 0 ? (
                            <div className="col-12">
                                <div className="glass-card p-5 text-center rounded-5 border-dashed">
                                    <div className="avatar-xl bg-light text-muted rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4 floating" style={{ width: '100px', height: '100px' }}>
                                        <Layers size={48} className="opacity-20" />
                                    </div>
                                    <h4 className="text-dark fw-bold mb-3">Portfolio Empty</h4>
                                    <p className="small text-muted mb-4 mx-auto" style={{ maxWidth: '350px' }}>
                                        Deploy your first intelligence unit to begin autonomous lead discovery and strategic outreach.
                                    </p>
                                    <button className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-sm" onClick={handleCreateNew}>Create First Unit</button>
                                </div>
                            </div>
                        ) : (
                            products.map((product, idx) => {
                                const isActive = activeProductIds.includes(product._id);
                                const isReady = product.executionReady;

                                return (
                                    <div key={product._id} className={`col-md-6 col-xl-4 animate__animated animate__fadeInUp`} style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className={`card h-100 border-0 shadow-lg intelligence-card rounded-5 overflow-hidden position-relative ${isActive ? 'active-unit-ring shadow-primary-25' : ''}`}>
                                            {isActive && (
                                                <div className="active-tag position-absolute top-0 start-0 w-100 text-center py-2 fw-bold text-white ls-1 bg-gradient-success">
                                                    LIVE EXECUTION MODE
                                                </div>
                                            )}

                                            <div className="card-body p-4 pt-5 pb-5">
                                                <div className="d-flex justify-content-between align-items-start mb-4 mt-2">
                                                    <div>
                                                        <h4 className="fw-bold mb-1 text-dark ls-tight">{product.name}</h4>
                                                        <div className="d-flex align-items-center gap-2 text-muted x-small fw-bold ls-1 opacity-75 uppercase">
                                                            <Cpu size={12} /> {product._id.toString().slice(-8).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className={`p-3 rounded-4 shadow-sm ${isReady ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                                        {isReady ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
                                                    </div>
                                                </div>

                                                <button
                                                    className="btn btn-outline-danger btn-sm border-0 position-absolute top-0 end-0 m-3 p-2 rounded-3 opacity-50 hover-opacity-100 transition-all"
                                                    onClick={(e) => { e.stopPropagation(); setDeleteId(product._id); }}
                                                    title="Remove Product"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                                <div className="d-flex gap-2 mb-4">
                                                    <span className="badge glass-badge text-dark">{product.marketMotion?.productType?.replace(/_/g, ' ') || 'DRAFT'}</span>
                                                    <span className="badge glass-badge text-dark">{product.marketMotion?.salesMotion?.replace(/_/g, ' ') || 'OUTBOUND'}</span>
                                                </div>

                                                <div className="knowledge-gauge mb-5 p-4 rounded-4 bg-light bg-opacity-50">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="x-small text-muted text-uppercase fw-bold ls-1">Intelligence Score</span>
                                                        <span className={`small fw-bold ${isReady ? 'text-success' : 'text-warning'}`}>{isReady ? '100%' : '40%'}</span>
                                                    </div>
                                                    <div className="progress rounded-pill bg-white shadow-inner" style={{ height: '8px' }}>
                                                        <div
                                                            className={`progress-bar rounded-pill shadow-sm transition-all duration-1000 ${isReady ? 'bg-gradient-primary' : 'bg-gradient-warning'}`}
                                                            style={{ width: isReady ? '100%' : '40%' }}
                                                        ></div>
                                                    </div>
                                                    <div className="mt-3 d-flex align-items-center gap-2 small text-muted">
                                                        {isReady ? (
                                                            <><CheckCircle2 size={14} className="text-success" /> Core logic fully compiled.</>
                                                        ) : (
                                                            <><Info size={14} className="text-warning" /> Strategy incomplete.</>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="d-flex flex-column gap-3">
                                                    <button
                                                        className="btn btn-outline-dark border-2 d-flex align-items-center justify-content-center gap-2 py-3 rounded-4 hover-dark transition-all fw-bold"
                                                        onClick={() => navigate(`/setup/${product._id}`)}
                                                    >
                                                        <Settings size={18} /> Configure Strategy
                                                    </button>
                                                    <button
                                                        className={`btn ${isActive ? 'btn-success text-white border-0' : 'btn-primary'} d-flex align-items-center justify-content-center gap-2 py-3 rounded-4 shadow-sm transition-all fw-bold`}
                                                        onClick={() => !isActive && handleActivate(product._id)}
                                                        disabled={isActive && isReady}
                                                    >
                                                        {isActive && isReady ? (
                                                            <><Zap size={18} className="fill-white" /> DEPLOYED & RUNNING</>
                                                        ) : isActive ? (
                                                            <><Activity size={18} /> AGENT ACTIVE (PENDING SETUP)</>
                                                        ) : (
                                                            <><Rocket size={18} /> Decommissioned (Deploy Now)</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {
                deleteId && (
                    <div className="solid-modal-overlay">
                        <div className="glass-card p-5 mt-4 rounded-5 border-0 shadow-2xl animate__animated animate__zoomIn" style={{ maxWidth: '450px', width: '90%' }}>
                            <div className="avatar-xl bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                                <Trash2 size={40} />
                            </div>
                            <h4 className="text-dark fw-bold text-center mb-3">Retire Intelligence Unit?</h4>
                            <p className="text-muted text-center mb-5 small">
                                This will permanently decommission this product unit and remove all associated autonomous agents. This action cannot be undone.
                            </p>
                            <div className="d-flex gap-3">
                                <button className="btn btn-light flex-grow-1 py-3 rounded-pill fw-bold" onClick={() => setDeleteId(null)} disabled={deleting}>
                                    Cancel
                                </button>
                                <button className="btn btn-danger flex-grow-1 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" onClick={handleDelete} disabled={deleting}>
                                    {deleting ? <span className="spinner-border spinner-border-sm" /> : 'Confirm Retirement'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <style dangerouslySetInnerHTML={{
                __html: `
                .ls-tight { letter-spacing: -0.5px; }
                .ls-1 { letter-spacing: 1px; }
                .x-small { font-size: 0.65rem; }
                .hover-scale:hover { transform: scale(1.02); }
                .hover-dark:hover { background: #1a1a1a; color: white; border-color: #1a1a1a; }
                .hover-opacity-100:hover { opacity: 1 !important; transform: scale(1.1); }
                
                .bg-gradient-primary { background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%); }
                .bg-gradient-warning { background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%); }
                .bg-gradient-success { background: linear-gradient(90deg, #10b981 0%, #34d399 100%); }
                .shadow-primary-25 { box-shadow: 0 10px 30px rgba(99, 102, 241, 0.15) !important; }
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                
                .glass-badge { 
                    background: rgba(0,0,0,0.05); 
                    backdrop-filter: blur(4px);
                    padding: 6px 14px;
                    border-radius: 8px;
                    font-size: 0.7rem;
                    border: 1px solid rgba(0,0,0,0.03);
                }

                .intelligence-card {
                    background: #ffffff;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .intelligence-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
                }

                .active-unit-ring {
                    border: 2px solid #10b981 !important;
                }

                .active-tag {
                    font-size: 0.6rem;
                    z-index: 9999;
                }

                .floating {
                    animation: floating 3s ease-in-out infinite;
                }
                @keyframes floating {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }

                .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); }
                .duration-1000 { transition-duration: 1000ms; }
                .uppercase { text-transform: uppercase; }

                .border-dashed { border: 2px dashed #e5e7eb !important; }
                .glass-card { 
                    background: #ffffff !important; 
                    box-shadow: 0 30px 60px rgba(0,0,0,0.3) !important; 
                    opacity: 1 !important;
                }
                
                .solid-modal-overlay {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    background: rgba(0,0,0,0.4) !important;
                    backdrop-filter: blur(8px) !important;
                    z-index: 99999 !important;
                    opacity: 1 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
            `}} />
        </AppLayout >
    );
}

export default ProductList;
