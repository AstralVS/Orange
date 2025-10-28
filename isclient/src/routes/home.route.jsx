import HomePage from '@/pages/HomePage';
import ProtectedRoute from './protected.route';

const homeRoute = [
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <HomePage />
            </ProtectedRoute>
        )
    }
];

export default homeRoute;
