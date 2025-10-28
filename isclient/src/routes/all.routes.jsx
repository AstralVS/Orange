import ShoppingLayout from '@/components/layouts/ShoppingLayout';
import authRoutes from './auth.routes';
import cartRoute from './cart.route';
import homeRoute from './home.route';
import productDetailRoute from './product-detail.route';

const allRoutes = [
    {
        element: <ShoppingLayout />,
        children: [...homeRoute, ...cartRoute, ...productDetailRoute]
    },
    ...authRoutes
];

export default allRoutes;
