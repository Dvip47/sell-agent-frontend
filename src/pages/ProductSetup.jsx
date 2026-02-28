import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Brain,
    Target,
    Users,
    Shield,
    Zap,
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    Save,
    CheckCircle2,
    MessageSquare,
    AlertCircle,
    ArrowRight,
    Search,
    Rocket,
    BarChart3,
    Image as ImageIcon,
    Upload,
    X,
    Info
} from 'lucide-react';
import AppLayout from '../components/Layout/AppLayout';
import Loader from '../components/Common/Loader';
import ErrorBox from '../components/Common/ErrorBox';
import EmailConfigSection from '../components/EmailConfigSection';
import { productAPI } from '../api/product.api';
import { emailTemplateAPI } from '../api/emailTemplate.api';
import { ProductSetupSkeleton } from '../components/ui/Skeleton';

function ProductSetup() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [activeStep, setActiveStep] = useState(1);
    const [executionReady, setExecutionReady] = useState(false);
    const [compiling, setCompiling] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [bannerConfig, setBannerConfig] = useState({
        enableBanner: false,
        bannerUrl: null,
        bannerAltText: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        marketMotion: {
            productType: 'HORIZONTAL_SAAS',
            salesMotion: 'OUTBOUND_LED',
            typicalDealMotion: 'DEMO_DRIVEN'
        },
        triggerEvents: [
            { event: 'TEAM_INEFFICIENCY', urgency: 'MEDIUM', externalVisibility: false, description: '' }
        ],
        whyNowLogic: {
            immediateDriver: '',
            breakingPoints: [''],
            closingSignal: ''
        },
        painDepth: [
            { problem: '', visibleToLeadership: false, budgetApproved: false, roleFeelingPain: '', roleSigningCheque: '' }
        ],
        buyerPsychology: {
            riskProfile: 'RISK_AVERSE',
            primaryFocus: 'GROWTH_FOCUSED',
            vendorStance: 'VENDOR_OPEN',
            technicalAptitude: 'TECH_SAVVY'
        },
        objectionMap: [
            { objection: '', isRealOrPolite: 'REAL', closingNuance: '', unlockKey: '' }
        ],
        buyingCommittee: {
            discoverer: '',
            evaluator: '',
            blocker: '',
            signer: '',
            internalFrictionPoints: ['']
        },
        positioning: {
            primaryEdge: 'FASTER',
            whereWeLose: [''],
            noFlyZones: ['']
        },
        disqualificationRules: [
            { criteria: '', reason: '' }
        ],
        confidenceBoundaries: {
            safeClaims: [''],
            riskyClaims: [''],
            forbiddenClaims: ['']
        },
        successDefinition: {
            goodMeetingOutcome: '',
            successMetric: '',
            stopPushingPoint: ''
        },
        customOutreachTemplates: ['', '', ''],
        senderDetails: {
            name: '',
            role: '',
            company: '',
            phone: ''
        },
        gtmBlueprint: {
            positioning: '',
            corePain: '',
            whyNow: '',
            differentiator: '',
            trustEnvelope: '',
            targetIndustry: '',
            targetRole: ''
        }
    });

    // ... 

    useEffect(() => {
        if (productId) {
            loadSetup(productId);
            loadBannerConfig(productId);
        } else {
            setLoading(false);
        }
    }, [productId]);

    const loadBannerConfig = async (id) => {
        try {
            const data = await emailTemplateAPI.getConfig(id);
            setBannerConfig(data);
        } catch (err) {
            console.error('Failed to load product banner config');
        }
    };

    const handleBannerUpload = async (file) => {
        if (!productId) {
            setError('Please save the product first before uploading a banner.');
            return;
        }
        if (file.size > 200 * 1024) {
            setError('Banner size must be under 200KB.');
            return;
        }
        setUploadingBanner(true);
        setError(null);
        try {
            const response = await emailTemplateAPI.uploadBanner(productId, file);
            setBannerConfig(prev => ({
                ...prev,
                bannerUrl: response.bannerUrl,
                enableBanner: true
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Banner upload failed');
        } finally {
            setUploadingBanner(false);
        }
    };

    const handleBannerToggle = async () => {
        if (!productId) return;
        const newVal = !bannerConfig.enableBanner;
        setBannerConfig(prev => ({ ...prev, enableBanner: newVal }));
        try {
            await emailTemplateAPI.updateConfig(productId, {
                enableBanner: newVal,
                bannerAltText: bannerConfig.bannerAltText
            });
        } catch (err) {
            console.error('Failed to sync banner toggle');
        }
    };

    const handleBannerAltChange = (val) => {
        setBannerConfig(prev => ({ ...prev, bannerAltText: val }));
    };

    const syncBannerAlt = async () => {
        if (!productId) return;
        try {
            await emailTemplateAPI.updateConfig(productId, {
                enableBanner: bannerConfig.enableBanner,
                bannerAltText: bannerConfig.bannerAltText
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save alt text');
        }
    };

    const loadSetup = async (id) => {
        setLoading(true);
        try {
            const data = await productAPI.getSetup(id);
            // Handle case where getSetup(id) might be needed. 
            // productAPI.getSetup currently doesn't take id. I need to update it.
            if (data && data.marketMotion) {
                setFormData(prev => {
                    const merged = { ...prev, ...data };
                    const objectsToMerge = ['marketMotion', 'whyNowLogic', 'buyerPsychology', 'buyingCommittee', 'positioning', 'confidenceBoundaries', 'successDefinition', 'gtmBlueprint'];
                    objectsToMerge.forEach(key => {
                        if (data[key]) {
                            merged[key] = { ...prev[key], ...data[key] };
                        }
                    });
                    return merged;
                });
                setExecutionReady(data.executionReady);
            }
        } catch {
            setError('Failed to load product intelligence');
        } finally {
            setLoading(false);
        }
    };

    const handleNestedChange = (path, value) => {
        const keys = path.split('.');
        setFormData(prev => {
            const newData = { ...prev };
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (Array.isArray(current[key])) {
                    current[key] = current[key] ? [...current[key]] : [];
                } else {
                    current[key] = current[key] ? { ...current[key] } : {};
                }
                current = current[key];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const handleArrayChange = (path, index, field, value) => {
        const keys = path.split('.');
        setFormData(prev => {
            const newData = { ...prev };
            let current = newData;
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (Array.isArray(current[key])) {
                    current[key] = current[key] ? [...current[key]] : [];
                } else {
                    current[key] = current[key] ? { ...current[key] } : {};
                }
                current = current[key];
            }
            current[index] = field ? { ...current[index], [field]: value } : value;
            return newData;
        });
    };

    const addArrayItem = (path, defaultValue) => {
        const keys = path.split('.');
        setFormData(prev => {
            const newData = { ...prev };
            let current = newData;
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (Array.isArray(current[key])) {
                    current[key] = current[key] ? [...current[key]] : [];
                } else {
                    current[key] = current[key] ? { ...current[key] } : {};
                }
                current = current[key];
            }
            if (Array.isArray(current)) {
                current.push(defaultValue);
            }
            return newData;
        });
    };

    const removeArrayItem = (path, index) => {
        const keys = path.split('.');
        setFormData(prev => {
            const newData = { ...prev };
            let current = newData;
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (Array.isArray(current[key])) {
                    current[key] = current[key] ? [...current[key]] : [];
                } else {
                    current[key] = current[key] ? { ...current[key] } : {};
                }
                current = current[key];
            }
            if (Array.isArray(current) && current.length > 1) {
                current.splice(index, 1);
            }
            return newData;
        });
    };

    const validateStep = (step) => {
        if (step === 1) {
            if (!formData.name?.trim()) {
                setError('Identity Name is required.');
                return false;
            }
        }
        setError(null);
        return true;
    };

    const handleSave = async (final = false) => {
        if (final && !validateStep(activeStep)) return;

        setSaving(true);
        if (final) setCompiling(true);
        try {
            const payload = { ...formData, executionReady: final ? true : executionReady };
            const savedProduct = await productAPI.saveSetup(payload);
            const id = productId || savedProduct._id;

            if (final) {
                await productAPI.compile(id);
                setExecutionReady(true);
                setTimeout(() => {
                    navigate('/settings');
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sync intelligence core');
        } finally {
            setSaving(false);
            setCompiling(false);
        }
    };

    const nextStep = () => {
        if (!validateStep(activeStep)) return;
        handleSave();
        setActiveStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setError(null);
        setActiveStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    if (loading && productId) return <AppLayout><ProductSetupSkeleton /></AppLayout>;
    if (loading) return <AppLayout><Loader text="Analyzing intelligence blueprint..." /></AppLayout>;
    if (error) return <AppLayout><ErrorBox error={error} onRetry={() => loadSetup(productId)} /></AppLayout>;

    return (
        <AppLayout>
            <div className="container py-4 px-4">
                <div className="row justify-content-center">
                    <div className="col-lg-11">
                        {/* Status Header */}
                        <div className="row mb-5 align-items-center">
                            <div className="col">
                                <h2 className="fw-bold text-dark mb-1">Intelligence Core Architect</h2>
                                <p className="text-muted small mb-0">Market-Beating Logic & Tactical Execution Blueprint</p>
                            </div>
                            <div className="col-auto">
                                <div className={`px-4 py-2 rounded-pill d-flex align-items-center gap-2 small fw-bold ${executionReady ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                    {executionReady ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    {executionReady ? 'Engine Authorized' : 'Setup In Progress'}
                                </div>
                            </div>
                        </div>

                        {/* Progress Stepper */}
                        <div className="mb-5 position-relative stepper-container py-4 glass-card rounded-5 px-5">
                            <div className="d-flex justify-content-between position-absolute top-50 start-0 w-100 translate-middle-y z-0 px-5" style={{ height: '3px' }}>
                                <div className="bg-light bg-opacity-50 w-100 position-relative rounded-pill">
                                    <div
                                        className="bg-gradient-primary shadow-glow transition-all position-absolute top-0 start-0 h-100 rounded-pill"
                                        style={{ width: `${((activeStep - 1) / 5) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between position-relative z-1">
                                {[
                                    { step: 1, label: 'Market', icon: Target },
                                    { step: 2, label: 'Triggers', icon: Zap },
                                    { step: 3, label: 'Psychology', icon: Brain },
                                    { step: 4, label: 'Positioning', icon: Shield },
                                    { step: 5, label: 'Outreach', icon: MessageSquare },
                                    { step: 6, label: 'Deploy', icon: Rocket }
                                ].map((s) => (
                                    <div key={s.step} className="d-flex flex-column align-items-center animate__animated animate__zoomIn" style={{ width: '80px', animationDelay: `${s.step * 50}ms` }}>
                                        <div
                                            className={`rounded-circle d-flex align-items-center justify-content-center border-2 transition-all stepper-node ${activeStep >= s.step ? 'active-node bg-dark shadow-glow' : 'bg-white text-muted hover-scale'}`}
                                            style={{ width: '48px', height: '48px', cursor: 'pointer', zIndex: 10 }}
                                            onClick={() => activeStep > s.step && setActiveStep(s.step)}
                                        >
                                            <s.icon size={22} className={activeStep >= s.step ? 'text-white' : 'text-muted'} />
                                        </div>
                                        <span className={`x-small mt-3 fw-bold text-uppercase ls-1 ${activeStep >= s.step ? 'text-dark' : 'text-muted'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 1: Market Motion */}
                        {activeStep === 1 && (
                            <div className="card glass-card border-0 shadow-2xl rounded-5 animate__animated animate__fadeInRight">
                                <div className="card-body p-4 p-md-5">
                                    <div className="d-flex align-items-center gap-4 mb-5">
                                        <div className="bg-gradient-primary text-white p-4 rounded-5 shadow-glow-primary">
                                            <Target size={32} />
                                        </div>
                                        <div>
                                            <h3 className="fw-bold text-dark mb-1 ls-tight">Intelligence & Market Velocity</h3>
                                            <p className="text-muted mb-0 opacity-75">Define the core DNA and primary sales motion for this agent unit.</p>
                                        </div>
                                    </div>

                                    <div className="row g-4 pt-2">
                                        <div className="col-12 mb-4">
                                            <div className="p-4 rounded-5 bg-dark text-white shadow-lg mb-4">
                                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                                    <Brain size={20} className="text-primary" /> Founder's GTM Blueprint
                                                </h5>
                                                <p className="small opacity-75 mb-4">This drives the "Founder-Level" cognitive outreach. Be precise and strategic.</p>

                                                <div className="row g-4">
                                                    <div className="col-md-6">
                                                        <label className="x-small text-uppercase fw-bold ls-1 mb-2 d-block text-primary">One-Line Positioning</label>
                                                        <input
                                                            className="form-control bg-white bg-opacity-10 border-0 text-white"
                                                            placeholder="e.g. The first autonomous sales engine that behaves like a founder."
                                                            value={formData.gtmBlueprint.positioning}
                                                            onChange={(e) => handleNestedChange('gtmBlueprint.positioning', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="x-small text-uppercase fw-bold ls-1 mb-2 d-block text-primary">Target Industry</label>
                                                        <input
                                                            className="form-control bg-white bg-opacity-10 border-0 text-white"
                                                            placeholder="e.g. High-Growth SaaS"
                                                            value={formData.gtmBlueprint.targetIndustry}
                                                            onChange={(e) => handleNestedChange('gtmBlueprint.targetIndustry', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="x-small text-uppercase fw-bold ls-1 mb-2 d-block text-primary">Ideal Buyer Role</label>
                                                        <input
                                                            className="form-control bg-white bg-opacity-10 border-0 text-white"
                                                            placeholder="e.g. VP of Sales / CEO"
                                                            value={formData.gtmBlueprint.targetRole}
                                                            onChange={(e) => handleNestedChange('gtmBlueprint.targetRole', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="x-small text-uppercase fw-bold ls-1 mb-2 d-block text-primary">Core Pain Solved</label>
                                                        <input
                                                            className="form-control bg-white bg-opacity-10 border-0 text-white"
                                                            placeholder="e.g. Inconsistent pipeline and slow hiring cycles."
                                                            value={formData.gtmBlueprint.corePain}
                                                            onChange={(e) => handleNestedChange('gtmBlueprint.corePain', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="x-small text-uppercase fw-bold ls-1 mb-2 d-block text-primary">Proof / Differentiator</label>
                                                        <input
                                                            className="form-control bg-white bg-opacity-10 border-0 text-white"
                                                            placeholder="e.g. Outbound logic tuned by real sales veterans."
                                                            value={formData.gtmBlueprint.differentiator}
                                                            onChange={(e) => handleNestedChange('gtmBlueprint.differentiator', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <label className="x-small text-uppercase fw-bold ls-1 mb-2 d-block text-danger">Trust Envelope (Forbidden Claims)</label>
                                                        <input
                                                            className="form-control bg-white bg-opacity-10 border-0 text-white"
                                                            placeholder="e.g. Do not claim pricing is public, do not mention we are an AI engine."
                                                            value={formData.gtmBlueprint.trustEnvelope}
                                                            onChange={(e) => handleNestedChange('gtmBlueprint.trustEnvelope', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12 mb-3">
                                            <label className="form-label small text-muted text-uppercase fw-bold ls-1 mb-2">Portfolio Identity Name</label>
                                            <div className="premium-input-group glass-input flex-grow-1">
                                                <Brain size={20} className="text-primary opacity-50 mx-3" />
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="e.g. SellAgent High-Growth SDR"
                                                    value={formData.name || ''}
                                                    onChange={(e) => handleNestedChange('name', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label small text-muted text-uppercase fw-bold ls-1 mb-2">Category</label>
                                            <div className="glass-select-container">
                                                <select
                                                    className="form-select glass-select"
                                                    value={formData.marketMotion.productType}
                                                    onChange={(e) => handleNestedChange('marketMotion.productType', e.target.value)}
                                                >
                                                    <option value="HORIZONTAL_SAAS">Horizontal SaaS</option>
                                                    <option value="VERTICAL_SAAS">Vertical SaaS</option>
                                                    <option value="AGENCY">Agency Services</option>
                                                    <option value="SERVICES">Enterprise Consulting</option>
                                                    <option value="INFRASTRUCTURE">Technical Infra</option>
                                                    <option value="OTHER">Other Domain</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted text-uppercase fw-bold ls-1 mb-2">Execution Mode</label>
                                            <div className="glass-select-container">
                                                <select
                                                    className="form-select glass-select"
                                                    value={formData.marketMotion.salesMotion}
                                                    onChange={(e) => handleNestedChange('marketMotion.salesMotion', e.target.value)}
                                                >
                                                    <option value="INBOUND_LED">Inbound-Led (PQL)</option>
                                                    <option value="OUTBOUND_LED">Outbound-Led (SDR)</option>
                                                    <option value="HYBRID">Hybrid Execution</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small text-muted text-uppercase fw-bold ls-1 mb-2">Conversion Event</label>
                                            <div className="glass-select-container">
                                                <select
                                                    className="form-select glass-select"
                                                    value={formData.marketMotion.typicalDealMotion}
                                                    onChange={(e) => handleNestedChange('marketMotion.typicalDealMotion', e.target.value)}
                                                >
                                                    <option value="DEMO_DRIVEN">Live Software Demo</option>
                                                    <option value="CALL_DRIVEN">Strategy/Discovery Call</option>
                                                    <option value="TRIAL_DRIVEN">Product Sandbox Activation</option>
                                                    <option value="PROPOSAL_DRIVEN">Strategic Business Proposal</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-12 mt-5">
                                            <div className="strategic-context-card p-4 rounded-5 border-start border-5 border-primary shadow-sm bg-gradient-light">
                                                <label className="form-label small text-dark text-uppercase fw-extrabold ls-1 d-flex align-items-center gap-2 mb-3">
                                                    <Zap size={18} className="text-warning fill-warning" /> The "Why Now" Strategic Driver
                                                </label>
                                                <textarea
                                                    className="form-control strategic-textarea shadow-none"
                                                    rows="4"
                                                    placeholder="What urgent shift, failure, or expansion forces a lead to need your product RIGHT NOW?"
                                                    value={formData.whyNowLogic.immediateDriver}
                                                    onChange={(e) => handleNestedChange('whyNowLogic.immediateDriver', e.target.value)}
                                                ></textarea>
                                                <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-4 x-small text-muted italic">
                                                    High-tier agents use this driver as the foundational 'Curiosity Hook' for high-conversion outreach.
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mt-5 pt-4">
                                        <button className="btn btn-primary btn-lg shadow-glow-primary px-5 py-3 rounded-pill fw-bold d-flex align-items-center gap-3 hover-scale transition-all" onClick={nextStep}>
                                            Save & Advance Logic <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Triggers & Pain Depth */}
                        {activeStep === 2 && (
                            <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                                <div className="card-body p-4 p-md-5">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-4">
                                            <Zap size={28} />
                                        </div>
                                        <div>
                                            <h4 className="fw-bold text-dark mb-1">Trigger Reality & Pain Depth</h4>
                                            <p className="text-muted small mb-0">Map the specific events that make leads vulnerable to your outreach.</p>
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <label className="form-label small text-muted text-uppercase fw-bold ls-1 mb-0">High-Intent Triggers</label>
                                            <button className="btn btn-sm btn-outline-dark rounded-pill px-3 d-flex align-items-center gap-1" onClick={() => addArrayItem('triggerEvents', { event: 'OTHER', urgency: 'MEDIUM', externalVisibility: false, description: '' })}>
                                                <Plus size={14} /> Add Trigger
                                            </button>
                                        </div>
                                        <div className="d-flex flex-column gap-3">
                                            {formData.triggerEvents.map((te, i) => (
                                                <div key={i} className="row g-2 align-items-center bg-light p-3 rounded-4 position-relative border border-transparent hover-border-light transition-all">
                                                    <div className="col-md-3">
                                                        <select className="form-select border-0 bg-white small" value={te.event} onChange={(e) => handleArrayChange('triggerEvents', i, 'event', e.target.value)}>
                                                            <option value="HIRING_SURGE">Hiring Surge</option>
                                                            <option value="FUNDING_EXPANSION">Funding/Expansion</option>
                                                            <option value="COMPLIANCE_CHANGE">Compliance Shift</option>
                                                            <option value="COST_PRESSURE">Cost Pressure</option>
                                                            <option value="TOOL_REPLACEMENT">Tech Migration</option>
                                                            <option value="TEAM_INEFFICIENCY">Operational Chaos</option>
                                                            <option value="MISSED_TARGETS">Missed Revenue</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <select className={`form-select border-0 bg-white small fw-bold ${te.urgency === 'HIGH' ? 'text-danger' : te.urgency === 'MEDIUM' ? 'text-warning' : 'text-info'}`} value={te.urgency} onChange={(e) => handleArrayChange('triggerEvents', i, 'urgency', e.target.value)}>
                                                            <option value="LOW">Low Heat</option>
                                                            <option value="MEDIUM">Warm</option>
                                                            <option value="HIGH">CRITICAL</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input className="form-control border-0 bg-white small" placeholder="Agent Logic: How to spot this? (e.g. Job post mentioning 'Security')" value={te.description} onChange={(e) => handleArrayChange('triggerEvents', i, 'description', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-1 text-end">
                                                        <button className="btn btn-sm text-danger-emphasis hover-bg-danger-subtle rounded-circle p-2" onClick={() => removeArrayItem('triggerEvents', i)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <label className="form-label small text-muted text-uppercase fw-bold ls-1 mb-0">Structural Pain Points</label>
                                            <button className="btn btn-sm btn-outline-dark rounded-pill px-3 d-flex align-items-center gap-1" onClick={() => addArrayItem('painDepth', { problem: '', visibleToLeadership: false, budgetApproved: false, roleFeelingPain: '', roleSigningCheque: '' })}>
                                                <Plus size={14} /> Add Pain Layer
                                            </button>
                                        </div>
                                        <div className="d-flex flex-column gap-3">
                                            {formData.painDepth.map((pd, i) => (
                                                <div key={i} className="bg-light p-4 rounded-4 border-start border-4 border-warning">
                                                    <div className="row g-3">
                                                        <div className="col-12">
                                                            <label className="x-small text-muted text-uppercase fw-bold ls-1">The Problem</label>
                                                            <input className="form-control border-0 bg-white py-2" placeholder="e.g. Manual data entry causing 20% error rate in reporting..." value={pd.problem} onChange={(e) => handleArrayChange('painDepth', i, 'problem', e.target.value)} />
                                                        </div>
                                                        <div className="col-md-5">
                                                            <label className="x-small text-muted text-uppercase fw-bold ls-1">Affected Persona</label>
                                                            <input className="form-control border-0 bg-white py-2 small" placeholder="e.g. Operations Manager" value={pd.roleFeelingPain} onChange={(e) => handleArrayChange('painDepth', i, 'roleFeelingPain', e.target.value)} />
                                                        </div>
                                                        <div className="col-md-5">
                                                            <label className="x-small text-muted text-uppercase fw-bold ls-1">Economic Buyer</label>
                                                            <input className="form-control border-0 bg-white py-2 small" placeholder="e.g. Head of Growth" value={pd.roleSigningCheque} onChange={(e) => handleArrayChange('painDepth', i, 'roleSigningCheque', e.target.value)} />
                                                        </div>
                                                        <div className="col-md-2 d-flex align-items-end justify-content-end">
                                                            <button className="btn btn-sm btn-outline-danger border-0 d-flex align-items-center gap-1" onClick={() => removeArrayItem('painDepth', i)}>
                                                                <Trash2 size={14} /> Remove
                                                            </button>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="form-check form-switch mt-1">
                                                                <input className="form-check-input" type="checkbox" checked={pd.visibleToLeadership} onChange={(e) => handleArrayChange('painDepth', i, 'visibleToLeadership', e.target.checked)} />
                                                                <label className="form-check-label x-small text-muted text-uppercase fw-bold ls-1 ms-2">Visible to Board/C-Suite?</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                                        <button className="btn btn-link text-muted text-decoration-none fw-bold d-flex align-items-center gap-2" onClick={prevStep}>
                                            <ChevronLeft size={18} /> Back
                                        </button>
                                        <button className="btn btn-dark px-5 py-2 rounded-pill fw-bold d-flex align-items-center gap-2" onClick={nextStep}>
                                            Save & Continue <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Step 3: Psychology & Objection Map */}
                        {activeStep === 3 && (
                            <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                                <div className="card-body p-4 p-md-5">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="bg-info bg-opacity-10 text-info p-3 rounded-4">
                                            <Brain size={28} />
                                        </div>
                                        <div>
                                            <h4 className="fw-bold text-dark mb-1">Buyer Psychology & Resistance</h4>
                                            <p className="text-muted small mb-0">Decode the mental model and common pushbacks of your target persona.</p>
                                        </div>
                                    </div>

                                    <div className="row g-4 mb-5">
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted text-uppercase fw-bold ls-1">Risk Profile</label>
                                            <select className="form-select border-0 bg-light py-2 px-3 fw-bold" value={formData.buyerPsychology.riskProfile} onChange={(e) => handleNestedChange('buyerPsychology.riskProfile', e.target.value)}>
                                                <option value="RISK_AVERSE">Risk Averse (Safety First)</option>
                                                <option value="RISK_TAKING">Risk Taking (Edge First)</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted text-uppercase fw-bold ls-1">Economic Focus</label>
                                            <select className="form-select border-0 bg-light py-2 px-3 fw-bold" value={formData.buyerPsychology.primaryFocus} onChange={(e) => handleNestedChange('buyerPsychology.primaryFocus', e.target.value)}>
                                                <option value="COST_FOCUSED">Cost Efficiency (Savings)</option>
                                                <option value="GROWTH_FOCUSED">Growth/Expansion (Revenue)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <label className="form-label small text-muted text-uppercase fw-bold ls-1 mb-0 text-primary">Objection Strategic Map</label>
                                            <button className="btn btn-sm btn-outline-primary rounded-pill px-3 d-flex align-items-center gap-1" onClick={() => addArrayItem('objectionMap', { objection: '', isRealOrPolite: 'REAL', closingNuance: '', unlockKey: '' })}>
                                                <Plus size={14} /> Add Counter-Logic
                                            </button>
                                        </div>
                                        <div className="d-flex flex-column gap-3">
                                            {formData.objectionMap.map((obj, i) => (
                                                <div key={i} className="bg-light p-4 rounded-4 border-start border-4 border-info">
                                                    <div className="row g-3">
                                                        <div className="col-md-8">
                                                            <label className="x-small text-muted text-uppercase fw-bold ls-1">The Resistance</label>
                                                            <input className="form-control border-0 bg-white py-2" placeholder="e.g. 'We don't have budget for this until Q4'" value={obj.objection} onChange={(e) => handleArrayChange('objectionMap', i, 'objection', e.target.value)} />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="x-small text-muted text-uppercase fw-bold ls-1">Objection Type</label>
                                                            <select className="form-select border-0 bg-white py-2 small fw-bold" value={obj.isRealOrPolite} onChange={(e) => handleArrayChange('objectionMap', i, 'isRealOrPolite', e.target.value)}>
                                                                <option value="REAL">Hard Constraint</option>
                                                                <option value="POLITE">Soft Brush-off</option>
                                                                <option value="MIXED">Situational</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-12">
                                                            <label className="x-small text-muted text-uppercase fw-bold ls-1">The 'Unlock' Key</label>
                                                            <div className="input-group shadow-sm rounded-3 overflow-hidden">
                                                                <span className="input-group-text bg-white border-0"><Zap size={14} className="text-warning" /></span>
                                                                <input className="form-control border-0 bg-white py-2 small" placeholder="Agent Strategy: How to flip the script? (e.g. Pivot to 'Operational Cost of Delay')" value={obj.unlockKey} onChange={(e) => handleArrayChange('objectionMap', i, 'unlockKey', e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-12 text-end">
                                                            <button className="btn btn-sm btn-link text-danger text-decoration-none x-small fw-bold" onClick={() => removeArrayItem('objectionMap', i)}>
                                                                DISCARD LOGIC
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                                        <button className="btn btn-link text-muted text-decoration-none fw-bold d-flex align-items-center gap-2" onClick={prevStep}>
                                            <ChevronLeft size={18} /> Back
                                        </button>
                                        <button className="btn btn-dark px-5 py-2 rounded-pill fw-bold d-flex align-items-center gap-2" onClick={nextStep}>
                                            Save & Continue <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Positioning & Hard Stops */}
                        {activeStep === 4 && (
                            <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                                <div className="card-body p-4 p-md-5">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-4">
                                            <Shield size={28} />
                                        </div>
                                        <div>
                                            <h4 className="fw-bold text-dark mb-1">Strategic Positioning & Disqualification</h4>
                                            <p className="text-muted small mb-0">Define precisely where you dominate and where the agent must walk away.</p>
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <label className="form-label small text-muted text-uppercase fw-bold ls-1">Primary Dominance Vector</label>
                                        <div className="d-flex gap-2 flex-wrap mb-4">
                                            {['CHEAPER', 'FASTER', 'SAFER', 'SPECIALIZED', 'ALL-IN-ONE', 'OTHER'].map(edge => (
                                                <button
                                                    key={edge}
                                                    className={`btn btn-sm px-4 py-2 rounded-pill transition-all fw-bold ${formData.positioning.primaryEdge === edge ? 'btn-dark' : 'btn-light text-muted'}`}
                                                    onClick={() => handleNestedChange('positioning.primaryEdge', edge)}
                                                >
                                                    {edge}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <label className="form-label small text-muted text-uppercase fw-bold ls-1 d-flex align-items-center gap-2">
                                                    <BarChart3 size={14} className="text-danger" /> Loss Signals (Where We Fail)
                                                </label>
                                                <div className="d-flex flex-column gap-2">
                                                    {formData.positioning.whereWeLose.map((l, i) => (
                                                        <div key={i} className="input-group">
                                                            <input className="form-control border-0 bg-light small py-2 px-3 fw-medium" placeholder="e.g. Prospect using Oracle ERP" value={l} onChange={(e) => handleArrayChange('positioning.whereWeLose', i, null, e.target.value)} />
                                                            <button className="btn btn-light border-0 px-3 transition-all hover-bg-danger-subtle text-danger" onClick={() => removeArrayItem('positioning.whereWeLose', i)}><Trash2 size={14} /></button>
                                                        </div>
                                                    ))}
                                                    <button className="btn btn-link btn-sm text-primary text-decoration-none fw-bold p-0 text-start mt-1 d-flex align-items-center gap-1" onClick={() => addArrayItem('positioning.whereWeLose', '')}>
                                                        <Plus size={14} /> ADD SIGNAL
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small text-muted text-uppercase fw-bold ls-1 d-flex align-items-center gap-2">
                                                    <AlertCircle size={14} className="text-warning" /> Hard Stop Rules
                                                </label>
                                                <div className="d-flex flex-column gap-2">
                                                    {formData.disqualificationRules.map((dr, i) => (
                                                        <div key={i} className="input-group">
                                                            <input className="form-control border-0 bg-light small py-2 px-3 fw-medium" placeholder="e.g. Employee count < 10" value={dr.criteria} onChange={(e) => handleArrayChange('disqualificationRules', i, 'criteria', e.target.value)} />
                                                            <button className="btn btn-light border-0 px-3 transition-all hover-bg-danger-subtle text-danger" onClick={() => removeArrayItem('disqualificationRules', i)}><Trash2 size={14} /></button>
                                                        </div>
                                                    ))}
                                                    <button className="btn btn-link btn-sm text-primary text-decoration-none fw-bold p-0 text-start mt-1 d-flex align-items-center gap-1" onClick={() => addArrayItem('disqualificationRules', { criteria: '', reason: '' })}>
                                                        <Plus size={14} /> ADD RULE
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                                        <button className="btn btn-link text-muted text-decoration-none fw-bold d-flex align-items-center gap-2" onClick={prevStep}>
                                            <ChevronLeft size={18} /> Back
                                        </button>
                                        <button className="btn btn-dark px-5 py-2 rounded-pill fw-bold d-flex align-items-center gap-2" onClick={nextStep}>
                                            Save & Review <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Outreach Templates */}
                        {activeStep === 5 && (
                            <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                                <div className="card-body p-4 p-md-5">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4">
                                            <MessageSquare size={28} />
                                        </div>
                                        <div>
                                            <h4 className="fw-bold text-dark mb-1">Strategic Outreach Templates</h4>
                                            <p className="text-muted small mb-0">Define 3 core strategic prompts the AI will adapt for your outreach.</p>
                                        </div>
                                    </div>

                                    {/* Sender Details Header */}
                                    <div className="bg-light p-4 rounded-4 mb-4">
                                        <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                                            <Users size={18} className="text-primary" /> Sender & Signature Details
                                        </h6>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small text-muted text-uppercase fw-bold ls-1">Sender Name</label>
                                                <input
                                                    className="form-control border-0 bg-white py-2 shadow-none fw-medium"
                                                    placeholder="e.g. Vipin Lohar"
                                                    value={formData.senderDetails?.name || ''}
                                                    onChange={(e) => handleNestedChange('senderDetails.name', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small text-muted text-uppercase fw-bold ls-1">Professional Role</label>
                                                <input
                                                    className="form-control border-0 bg-white py-2 shadow-none fw-medium"
                                                    placeholder="e.g. Founder & CEO"
                                                    value={formData.senderDetails?.role || ''}
                                                    onChange={(e) => handleNestedChange('senderDetails.role', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small text-muted text-uppercase fw-bold ls-1">Company Name</label>
                                                <input
                                                    className="form-control border-0 bg-white py-2 shadow-none fw-medium"
                                                    placeholder="e.g. Acme Corp"
                                                    value={formData.senderDetails?.company || ''}
                                                    onChange={(e) => handleNestedChange('senderDetails.company', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small text-muted text-uppercase fw-bold ls-1">Contact Number (Optional)</label>
                                                <input
                                                    className="form-control border-0 bg-white py-2 shadow-none fw-medium"
                                                    placeholder="e.g. +91 98765 43210"
                                                    value={formData.senderDetails?.phone || ''}
                                                    onChange={(e) => handleNestedChange('senderDetails.phone', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Brand Assets & Banners */}
                                    <div className="bg-light p-4 rounded-4 mb-4 border-start border-4 border-info">
                                        <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                                            <ImageIcon size={18} className="text-info" /> Campaign Banner Assets
                                        </h6>

                                        <div className="form-check form-switch mb-4">
                                            <input
                                                className="form-check-input shadow-none cursor-pointer"
                                                type="checkbox"
                                                id="enableBanner"
                                                checked={bannerConfig.enableBanner}
                                                onChange={handleBannerToggle}
                                            />
                                            <label className="form-check-label small fw-bold text-dark ms-2 cursor-pointer" htmlFor="enableBanner">
                                                Enable Embedded Campaign Banner
                                            </label>
                                        </div>

                                        {bannerConfig.enableBanner && (
                                            <div className="row g-3 animate__animated animate__fadeIn">
                                                <div className="col-md-6">
                                                    <label className="form-label x-small text-muted text-uppercase fw-bold ls-1 mb-2">Banner Asset (Max 200KB)</label>
                                                    {bannerConfig.bannerUrl ? (
                                                        <div className="position-relative rounded-3 border bg-white overflow-hidden p-2">
                                                            <img src={bannerConfig.bannerUrl} alt="Banner" className="img-fluid rounded-2" style={{ maxHeight: '100px', objectFit: 'contain' }} />
                                                            <button className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0 m-1" onClick={async () => {
                                                                if (confirm('Remove banner?')) {
                                                                    await emailTemplateAPI.removeBanner(productId);
                                                                    loadBannerConfig(productId);
                                                                }
                                                            }}><X size={12} /></button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="border-2 border-dashed rounded-4 p-4 text-center cursor-pointer hover-bg-white transition-all"
                                                            onClick={() => document.getElementById('banner-upload').click()}
                                                        >
                                                            {uploadingBanner ? <div className="spinner-border spinner-border-sm text-primary"></div> : <Upload size={24} className="text-muted mb-2" />}
                                                            <div className="x-small fw-bold text-muted">Click to Upload PNG/JPG</div>
                                                            <input id="banner-upload" type="file" className="d-none" accept=".png,.jpg,.jpeg" onChange={(e) => handleBannerUpload(e.target.files[0])} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label x-small text-muted text-uppercase fw-bold ls-1 mb-2">Banner Alt Text</label>
                                                    <div className="premium-input-group px-3 bg-white">
                                                        <Info size={14} className="text-muted me-2" />
                                                        <input
                                                            className="form-control border-0 bg-transparent x-small py-2"
                                                            placeholder="e.g. Special Offer..."
                                                            value={bannerConfig.bannerAltText}
                                                            onChange={(e) => handleBannerAltChange(e.target.value)}
                                                            onBlur={syncBannerAlt}
                                                        />
                                                    </div>
                                                    <div className="x-small text-muted mt-2 italic">Essential for email accessibility & spam filtering.</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email Configuration */}
                                    <EmailConfigSection
                                        productId={productId}
                                        emailConfig={formData.emailConfig}
                                        onUpdate={async (emailConfig) => {
                                            const updated = { ...formData, emailConfig };
                                            setFormData(updated);
                                            await saveProduct(updated);
                                        }}
                                    />

                                    <div className="row g-4 mb-4">
                                        {[0, 1, 2].map((i) => (
                                            <div key={i} className="col-12">
                                                <div className="bg-light p-4 rounded-4 border-start border-4 border-primary">
                                                    <label className="form-label small text-muted text-uppercase fw-bold ls-1 d-flex align-items-center gap-2 mb-2">
                                                        <Zap size={14} className="text-primary" /> Template Prompt {i + 1}
                                                    </label>
                                                    <textarea
                                                        className="form-control border-0 bg-white py-3 shadow-none fw-medium"
                                                        rows="4"
                                                        placeholder={`Strategic Angle ${i + 1}: e.g. Focus on how our automation reduces 40% of manual overhead...`}
                                                        value={formData.customOutreachTemplates[i] || ''}
                                                        onChange={(e) => {
                                                            const newTemplates = [...formData.customOutreachTemplates];
                                                            newTemplates[i] = e.target.value;
                                                            handleNestedChange('customOutreachTemplates', newTemplates);
                                                        }}
                                                    />
                                                    <p className="x-small text-muted mt-2 mb-0 italic">The AI will hyper-personalize this specific strategic angle for each lead it contacts.</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                                        <button className="btn btn-link text-muted text-decoration-none fw-bold d-flex align-items-center gap-2" onClick={prevStep}>
                                            <ChevronLeft size={18} /> Back
                                        </button>
                                        <button className="btn btn-dark px-5 py-2 rounded-pill fw-bold d-flex align-items-center gap-2" onClick={nextStep}>
                                            Save & Review <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 6: Success & Review */}
                        {activeStep === 6 && (
                            <div className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn">
                                <div className="card-body p-4 p-md-5">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="bg-success bg-opacity-10 text-success p-3 rounded-4">
                                            <Rocket size={28} />
                                        </div>
                                        <div>
                                            <h4 className="fw-bold text-dark mb-1">Final Intelligence Compilation</h4>
                                            <p className="text-muted small mb-0">Authorize the agent to begin autonomous execution based on this profile.</p>
                                        </div>
                                    </div>

                                    <div className="row g-4 mb-5">
                                        <div className="col-12">
                                            <div className="bg-light p-4 rounded-4 border-start border-4 border-dark">
                                                <label className="form-label small text-muted text-uppercase fw-bold ls-1 d-flex align-items-center gap-2 mb-2">
                                                    <CheckCircle2 size={14} /> Defined "Conversion" Event
                                                </label>
                                                <input
                                                    className="form-control border-0 bg-white py-3 shadow-none fw-bold"
                                                    placeholder="e.g. Booking a 15-min discovery call, agreeing to a POC..."
                                                    value={formData.successDefinition.goodMeetingOutcome}
                                                    onChange={(e) => handleNestedChange('successDefinition.goodMeetingOutcome', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted text-uppercase fw-bold ls-1">Confidence: Safe Claims</label>
                                            <div className="d-flex flex-column gap-2">
                                                {formData.confidenceBoundaries.safeClaims.map((c, i) => (
                                                    <input key={i} className="form-control border-0 bg-light py-2 px-3 small fw-medium" placeholder="Claim within bounds..." value={c} onChange={(e) => handleArrayChange('confidenceBoundaries.safeClaims', i, null, e.target.value)} />
                                                ))}
                                                <button className="btn btn-link btn-sm text-primary text-decoration-none fw-bold p-0 text-start d-flex align-items-center gap-1" onClick={() => addArrayItem('confidenceBoundaries.safeClaims', '')}>
                                                    <Plus size={14} /> ADD CLAIM
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-muted text-uppercase fw-bold ls-1 text-danger">Forbidden Claims</label>
                                            <div className="d-flex flex-column gap-2">
                                                {formData.confidenceBoundaries.forbiddenClaims.map((c, i) => (
                                                    <input key={i} className="form-control border-0 bg-danger bg-opacity-10 text-danger-emphasis py-2 px-3 small fw-bold" placeholder="NEVER MENTION THIS..." value={c} onChange={(e) => handleArrayChange('confidenceBoundaries.forbiddenClaims', i, null, e.target.value)} />
                                                ))}
                                                <button className="btn btn-link btn-sm text-danger text-decoration-none fw-bold p-0 text-start d-flex align-items-center gap-1" onClick={() => addArrayItem('confidenceBoundaries.forbiddenClaims', '')}>
                                                    <Plus size={14} /> ADD FORBIDDEN CLAIM
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="alert bg-dark text-white border-0 p-4 rounded-4 mb-5 shadow-lg d-flex gap-4 align-items-center">
                                        <div className="bg-white bg-opacity-10 p-3 rounded-circle">
                                            <Shield size={32} className="text-white" />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Authorization Protocol Alpha</h6>
                                            <p className="small mb-0 opacity-75">
                                                By compiling this intelligence, you authorize the SellAgent Engine to autonomously engage prospects.
                                                The agent will strictly adhere to the defined confidence boundaries and disqualification rules.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                                        <button className="btn btn-link text-muted text-decoration-none fw-bold d-flex align-items-center gap-2" onClick={prevStep}>
                                            <ChevronLeft size={18} /> Back
                                        </button>
                                        <button
                                            className={`btn btn-lg rounded-pill px-5 fw-bold transition-all d-flex align-items-center gap-2 ${executionReady ? 'btn-success' : 'btn-dark'}`}
                                            disabled={saving || compiling}
                                            onClick={() => handleSave(true)}
                                        >
                                            {compiling ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Hardening Intelligence Core...
                                                </>
                                            ) : executionReady ? (
                                                <>
                                                    <CheckCircle2 size={20} /> Logic Finalized
                                                </>
                                            ) : (
                                                <>
                                                    <Rocket size={20} /> Compile & Authorize
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .container { max-width: 1300px; }
                .ls-tight { letter-spacing: -0.8px; }
                .ls-1 { letter-spacing: 1.5px; }
                .x-small { font-size: 0.65rem; }
                .fw-extrabold { font-weight: 800; }
                
                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                }

                .bg-gradient-primary {
                    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                }
                .bg-gradient-light {
                    background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(248,249,250,1) 100%);
                }

                .shadow-glow {
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
                }
                .shadow-glow-primary {
                    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
                }

                .stepper-container {
                    border: 1px solid rgba(0,0,0,0.02);
                }

                .stepper-node {
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .stepper-node.active-node {
                    transform: scale(1.15);
                    border-color: transparent !important;
                }

                .premium-input-group {
                    display: flex;
                    align-items: center;
                    background: #fdfdfd;
                    border: 2px solid #f1f3f5;
                    border-radius: 16px;
                    transition: all 0.3s ease;
                }
                .premium-input-group:focus-within {
                    border-color: #6366f1;
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.05);
                }
                .premium-input-group .form-control {
                    border: none;
                    background: transparent;
                    padding: 14px 16px 14px 0;
                    font-weight: 600;
                    color: #1a1a1a;
                }

                .glass-select-container {
                    position: relative;
                    background: #fdfdfd;
                    border: 2px solid #f1f3f5;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .glass-select-container:focus-within {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.05);
                }
                .glass-select {
                    border: none;
                    background: transparent;
                    padding: 12px 16px;
                    font-weight: 500;
                    cursor: pointer;
                }

                .strategic-context-card {
                    background: #f8f9fa;
                    border-radius: 20px;
                }
                .strategic-textarea {
                    border: none;
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 20px;
                    font-weight: 500;
                    line-height: 1.6;
                    color: #2d3436;
                    resize: none;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
                }
                .strategic-textarea:focus {
                    background: #fff;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
                }

                .hover-scale { transition: transform 0.2s ease; }
                .hover-scale:hover { transform: scale(1.05); }

                .duration-1000 { transition-duration: 1000ms; }
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }

                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(99, 102, 241, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                }
                .active-node {
                    animation: pulse-glow 2s infinite;
                }
            `}</style>
        </AppLayout>
    );
}

export default ProductSetup;

