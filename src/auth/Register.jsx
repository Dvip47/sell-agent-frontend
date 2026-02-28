import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth.api';

/**
 * Register Component
 * 
 * GATEKEEPER, NOT SIGNUP
 * 
 * Purpose:
 * - Filter unserious users
 * - Collect GST for verification
 * - Create PENDING_VERIFICATION accounts
 * 
 * Rules:
 * - GST is MANDATORY
 * - Account goes to PENDING_VERIFICATION
 * - Delay = seriousness = trust
 */
function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyName: '',
        gstNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const validateGST = (gst) => {
        // GST format: 22AAAAA0000A1Z5 (15 characters)
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gst.toUpperCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        if (!validateGST(formData.gstNumber)) {
            setError('Please enter a valid GST number');
            setLoading(false);
            return;
        }

        try {
            await authAPI.register({
                companyName: formData.companyName,
                gstNumber: formData.gstNumber.toUpperCase(),
                email: formData.email,
                password: formData.password
            });

            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Success state - show verification message
    if (success) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-5 col-lg-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4 text-center">
                                    <div className="mb-4">
                                        <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                                            <span className="text-success fs-4">✓</span>
                                        </div>
                                    </div>
                                    <h5 className="fw-normal text-dark mb-3">Account Submitted</h5>
                                    <p className="text-muted small mb-4">
                                        Your account is under verification.<br />
                                        Activation may take up to 24 hours.
                                    </p>
                                    <p className="text-muted small mb-4">
                                        We will notify you at <strong>{formData.email}</strong> once your account is activated.
                                    </p>
                                    <a href="/login" className="btn btn-dark">
                                        Back to Sign In
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <h4 className="fw-normal text-dark">Request Access</h4>
                                    <p className="text-muted small mb-0">SellAgent for Businesses</p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger alert-sm" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="companyName" className="form-label small text-muted">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="companyName"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            placeholder="Your registered company name"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="gstNumber" className="form-label small text-muted">
                                            GST Number <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="gstNumber"
                                            name="gstNumber"
                                            value={formData.gstNumber}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            placeholder="22AAAAA0000A1Z5"
                                            style={{ textTransform: 'uppercase' }}
                                        />
                                        <div className="form-text">
                                            Required for business verification
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label small text-muted">
                                            Official Business Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            placeholder="you@yourcompany.com"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label small text-muted">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            minLength={8}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="form-label small text-muted">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100"
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : 'Submit for Verification'}
                                    </button>
                                </form>

                                <div className="text-center mt-3">
                                    <p className="text-muted small mb-0">
                                        Already have an account?{' '}
                                        <a href="/login" className="text-dark text-decoration-none fw-medium">
                                            Sign In
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-3">
                            <p className="text-muted small">
                                Accounts are verified within 24 hours
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
