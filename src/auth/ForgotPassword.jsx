import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api/auth.api';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await authAPI.forgotPassword({ email });
            setMessage(response.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <h4 className="fw-normal text-dark">Reset Password</h4>
                                    <p className="text-muted small">Enter your email and we'll send instructions.</p>
                                </div>

                                {message && (
                                    <div className="alert alert-success alert-sm" role="alert">
                                        {message}
                                    </div>
                                )}
                                {error && (
                                    <div className="alert alert-danger alert-sm" role="alert">
                                        {error}
                                    </div>
                                )}

                                {!message && (
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label small text-muted">Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-dark w-100"
                                            disabled={loading}
                                        >
                                            {loading ? 'Sending...' : 'Send Reset Link'}
                                        </button>
                                    </form>
                                )}

                                <div className="text-center mt-3">
                                    <Link to="/login" className="text-muted small text-decoration-none">
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
