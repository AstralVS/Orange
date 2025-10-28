import { getUserById } from '@/services/users.service';
import '@/styles/login.page.scss';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const USER_ID_STORAGE_KEY = 'userId';
const USER_NAME_STORAGE_KEY = 'userName';

const LoginPage = () => {
    const [inputUserId, setInputUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loggedInUserId = localStorage.getItem(USER_ID_STORAGE_KEY);
        if (loggedInUserId) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [navigate, location.state]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!inputUserId.trim()) {
            setError('Please enter User ID.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await getUserById(inputUserId.trim());

            const userData = response.data;

            if (userData && typeof userData === 'object' && userData._id) {
                localStorage.setItem(USER_ID_STORAGE_KEY, userData._id);
                localStorage.setItem(
                    USER_NAME_STORAGE_KEY,
                    userData.username || ''
                );
                setSuccessMessage(
                    `Login successful with User ID: ${userData._id}! Navigating....`
                );

                window.dispatchEvent(
                    new CustomEvent('authChanged', {
                        detail: {
                            isLoggedIn: true,
                            userId: userData._id,
                            userName: userData.username || ''
                        }
                    })
                );

                setTimeout(() => {
                    const from = location.state?.from?.pathname || '/';
                    navigate(from, { replace: true });
                }, 1500);
            } else if (userData === 'Invalid ID') {
                setError('Invalid User ID format.');
            } else {
                setError(
                    'User ID does not exist or is invalid. Please try again.'
                );
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response && err.response.status === 404) {
                setError('User ID does not exist (404).');
            } else if (err.message === 'Invalid User ID format for lookup.') {
                setError('Invalid User ID format.');
            } else {
                setError('Login failed. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-form-wrapper">
                <h1 className="login-title">Login</h1>
                <p className="login-subtitle">Enter User ID to continue.</p>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="userIdInput" className="form-label">
                            User ID:
                        </label>
                        <input
                            type="text"
                            id="userIdInput"
                            className="form-input"
                            value={inputUserId}
                            onChange={(e) => setInputUserId(e.target.value)}
                            placeholder="Enter your User ID"
                            disabled={loading}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && (
                        <p className="success-message">{successMessage}</p>
                    )}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
