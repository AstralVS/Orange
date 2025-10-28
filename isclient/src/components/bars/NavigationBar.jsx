import {
    getLoginStateLocalStorage,
    getUserIdLocalStorage,
    getUserNameLocalStorage
} from '@/helpers/localstorage/getdata.localstorage';
import { clearLocalStorage } from '@/helpers/localstorage/remove.localstorage';
import '@/styles/NavigationBar.scss';
import { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(getLoginStateLocalStorage());

    const navigate = useNavigate();

    const updateLoginStatus = useCallback(() => {
        setIsLoggedIn(getLoginStateLocalStorage());
    }, []);

    useEffect(() => {
        updateLoginStatus();

        const handleAuthChange = () => {
            updateLoginStatus();
        };

        window.addEventListener('authChanged', handleAuthChange);

        return () => {
            window.removeEventListener('authChanged', handleAuthChange);
        };
    }, [updateLoginStatus]);

    const handleLogout = () => {
        clearLocalStorage();

        setIsLoggedIn(false);
        window.dispatchEvent(
            new CustomEvent('authChanged', { detail: { isLoggedIn: false } })
        );
        navigate('/login');
    };

    return (
        <nav className="navbar-component">
            <div className="navbar-container">
                <div className="navbar-content">
                    <div className="navbar-left-placeholder">
                        {isLoggedIn && getUserIdLocalStorage() && (
                            <span className="navbar-greeting">
                                Hello, {getUserNameLocalStorage()}!
                            </span>
                        )}
                    </div>

                    <div className="navbar-center">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? 'navbar-navlink navbar-active-link'
                                    : 'navbar-navlink'
                            }
                        >
                            Home
                        </NavLink>
                    </div>

                    <div className="navbar-right">
                        <NavLink
                            to="/cart"
                            className={({ isActive }) =>
                                isActive
                                    ? 'navbar-navlink navbar-active-link'
                                    : 'navbar-navlink'
                            }
                        >
                            Cart
                        </NavLink>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="navbar-logout-button"
                            >
                                Log out
                            </button>
                        ) : (
                            <NavLink to="/login" className="navbar-navlink">
                                Login
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
