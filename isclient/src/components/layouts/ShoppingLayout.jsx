import '@/styles/client.layout.scss';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../bars/NavigationBar';

const ShoppingLayout = () => {
    return (
        <>
            <div className="client-layout-wrapper">
                <NavigationBar />
                <div className="client-layout-content">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default ShoppingLayout;
