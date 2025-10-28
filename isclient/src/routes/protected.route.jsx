// src/components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

const USER_ID_STORAGE_KEY = 'userId';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem(USER_ID_STORAGE_KEY);

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
