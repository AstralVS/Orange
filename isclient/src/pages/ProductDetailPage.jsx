import RecommendedProducts from '@/components/compts.pages/home.page.compts/RecommendedProducts';
import { getProductById } from '@/services/products.service';
import { recordUserAction } from '@/services/useractions.service';
import '@/styles/product-detail.page.scss';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetailPage = () => {
    const { id: product_id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState('');

    const logViewAction = useCallback(async (p_id, u_id) => {
        if (p_id && u_id) {
            try {
                await recordUserAction({
                    action_type: 'VIEW',
                    product_id: p_id,
                    user_id: u_id
                });
                console.log(
                    `Action VIEW recorded for product ${p_id} by user ${u_id}`
                );
            } catch (error) {
                console.error('Error recording user action:', error);
            }
        } else {
            console.warn(
                'Cannot record VIEW action: currentUserId or productId is not valid for logging.'
            );
        }
    }, []);

    const handleAddToCart = () => {
        if (product) {
            const cartItems = JSON.parse(
                localStorage.getItem('cartItems') || '[]'
            );
            const existingItemIndex = cartItems.findIndex(
                (item) => item.id === product.id
            );

            if (existingItemIndex > -1) {
                cartItems[existingItemIndex].quantity =
                    (cartItems[existingItemIndex].quantity || 1) + 1;
            } else {
                cartItems.push({ ...product, quantity: 1 });
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            alert(`"${product.name}" was added to your cart!`);
        }
    };

    const formatPrice = (price) => {
        if (typeof price !== 'number') return 'N/A';
        return price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

    useEffect(() => {
        setCurrentUserId(localStorage.getItem('userId'));
    }, []);

    useEffect(() => {
        (async () => {
            if (!product_id) {
                setError('Product ID is missing.');
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            setProduct(null);

            try {
                const response = await getProductById(product_id);
                if (response && response.data) {
                    setProduct(response.data);
                    logViewAction(product_id, currentUserId);
                } else {
                    setError('Product not found.');
                    setTimeout(() => navigate('/'), 3000);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('An error occurred while fetching the product.');
            } finally {
                setLoading(false);
            }
        })();
    }, [product_id, currentUserId, logViewAction, navigate]);

    if (loading)
        return (
            <p className="product-detail-loading">Loading product detail...</p>
        );
    if (error) return <p className="product-detail-error">Lỗi: {error}</p>;
    if (!product)
        return <p className="product-detail-not-found">Not found product</p>;
    return (
        <>
            <div className="product-detail-page-container">
                <div className="product-detail-main-content">
                    <div className="product-detail-image-container">
                        <img
                            src={
                                product.image_url ||
                                'https://png.pngtree.com/png-clipart/20250104/original/pngtree-orange-slice-half-cut-png-image_18733135.png'
                            }
                            alt={product.name}
                            className="product-detail-image"
                        />
                    </div>
                    <div className="product-detail-info">
                        <h1 className="product-detail-name">{product.name}</h1>
                        <p className="product-detail-category">
                            Category: <span>{product.category}</span>
                        </p>
                        <p className="product-detail-price">
                            {formatPrice(product.price)}
                        </p>
                        <p className="product-detail-description-title">
                            Description:
                        </p>
                        <div
                            className="product-detail-description-text"
                            dangerouslySetInnerHTML={{
                                __html:
                                    product.description ||
                                    'This product has no description available.'
                            }}
                        />
                        <button
                            className="product-detail-add-to-cart-button"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

                {currentUserId && (
                    <div className="product-detail-recommendations-section">
                        <RecommendedProducts userId={currentUserId} />
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductDetailPage;
