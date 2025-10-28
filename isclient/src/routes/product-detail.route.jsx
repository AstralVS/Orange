import ProductDetailPage from '@/pages/ProductDetailPage';
import ProtectedRoute from './protected.route';

const productDetailRoute = [
    {
        path: '/product/:id',
        element: (
            <ProtectedRoute>
                <ProductDetailPage />
            </ProtectedRoute>
        )
    }
];

export default productDetailRoute;
