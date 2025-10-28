import '@/styles/ProductCard.scss';
import { isEmptyProduct } from '@/utils/data.checking';
import { formatLongString, formatPriceVND } from '@/utils/data.normalization';
import { Link } from 'react-router-dom';
import ProductImg from '../media/ProductImg';

const ProductCard = (props) => {
    const { product } = props;

    if (isEmptyProduct(product)) return null;

    return (
        <div className="product-card-component">
            <Link to={`/product/${product.id}`} className="product-card-link">
                <div className="product-card-image-container">
                    <ProductImg
                        productImg={product.image_url}
                        productName={product.name}
                        className="product-card-image"
                    />
                </div>
                <div className="product-card-content">
                    <h3 className="product-card-name">{product.name}</h3>
                    <p className="product-card-category">{product.category}</p>
                    <p className="product-card-description">
                        {product.description
                            ? formatLongString(product.description, 60)
                            : 'No description available'}
                    </p>
                    <p className="product-card-price">
                        {formatPriceVND(product.price)}
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
