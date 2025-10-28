import CartPage from '@/pages/CartPage';
import ProtectedRoute from './protected.route';

const cartRoute = [
    {
        path: '/cart',
        element: (
            <ProtectedRoute>
                <CartPage />
            </ProtectedRoute>
        )
    }
];

export default cartRoute;
