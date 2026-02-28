import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/auth.api';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await authAPI.resetPassword({ token, password });
            setMessage(response.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="alert alert-danger">Invalid or missing reset token.</div>
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
                                    <h4 className="fw-normal text-dark">Update Password</h4>
                                    <p className="text-muted small">Choose a new, secure password.</p>
                                </div>

                                {message && (
                                    <div className="alert alert-success alert-sm" role="alert">
                                        {message} Redirecting to login...
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
                                            <label className="form-label small text-muted">New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={8}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Confirm Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-dark w-100"
                                            disabled={loading}
                                        >
                                            {loading ? 'Updating...' : 'Update Password'}
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

export default ResetPassword;
