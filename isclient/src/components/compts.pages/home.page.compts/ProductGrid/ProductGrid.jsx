import '@/styles/ProductGrid.scss';
import ProductCard from '../../../items/ProductCard';

const ProductGrid = (props) => {
    const { products, loading, error, title } = props;

    if (loading)
        return <p className="product-grid-message">Loading products...</p>;
    if (error)
        return (
            <p className="product-grid-message product-grid-error">
                Error: {error}
            </p>
        );
    if (!products || products.length === 0)
        return <p className="product-grid-message">No products found.</p>;

    return (
        <section className="product-grid-component-container">
            <h2 className="product-grid-title">{title}</h2>
            <div className="product-grid-scroll-container">
                <div className="product-grid-layout">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
