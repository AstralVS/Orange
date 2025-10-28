import { getRecommendations } from '@/services/recommendation.service';
import '@/styles/RecommendedProducts.scss';
import { useEffect, useState } from 'react';
import ProductCard from '../../items/ProductCard';

const RecommendedProducts = (props) => {
    const { userId } = props;

    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setRecommendations([]);
            setError(null);
            return;
        }
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getRecommendations(userId);
                setRecommendations(response.data);
            } catch (err) {
                console.error(
                    `Error fetching recommendations for user ${userId}:`,
                    err
                );
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        'Could not load recommendations.'
                );
                setRecommendations([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    if (!userId || (!loading && !error && recommendations.length === 0)) {
        return null;
    }

    if (loading)
        return (
            <p className="recommended-products-message">
                Loading suggested products...
            </p>
        );
    if (error)
        return (
            <p className="recommended-products-message recommended-products-error">
                Error suggestion: {error}
            </p>
        );

    return (
        <section className="recommended-products-component-container">
            <h2 className="recommended-products-title">Recommended for you</h2>
            <div className="recommended-products-scroll-wrapper">
                <div className="recommended-products-list-horizontal">
                    {recommendations.map((product) => (
                        <div
                            className="recommended-product-item"
                            key={product.id}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecommendedProducts;
