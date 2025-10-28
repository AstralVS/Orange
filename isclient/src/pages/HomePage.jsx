import CategoryList from '@/components/compts.pages/home.page.compts/CategoryList';
import ProductGrid from '@/components/compts.pages/home.page.compts/ProductGrid/ProductGrid';
import RecommendedProducts from '@/components/compts.pages/home.page.compts/RecommendedProducts';
import { getProducts } from '@/services/products.service';
import '@/styles/home.page.scss';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productError, setProductError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState('');

    useEffect(() => {
        setCurrentUserId(localStorage.getItem('userId'));
    }, []);

    useEffect(() => {
        (async () => {
            try {
                setLoadingProducts(true);
                setProductError(null);
                const response = await getProducts(selectedCategoryId);
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products in HomePage:', err);
                setProductError(err.message || 'Could not load products.');
                setProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        })();
    }, [selectedCategoryId]);

    const handleSelectCategory = (categoryId) => {
        setSelectedCategoryId(categoryId);
    };

    return (
        <div className="homepage-component-container">
            <div className="homepage-main-layout">
                <CategoryList
                    onSelectCategory={handleSelectCategory}
                    selectedCategoryId={selectedCategoryId}
                />
                <div className="homepage-content-area">
                    <RecommendedProducts userId={currentUserId} />
                    <ProductGrid
                        products={products}
                        loading={loadingProducts}
                        error={productError}
                        title={
                            selectedCategoryId
                                ? 'Products By Category'
                                : 'All Products'
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
