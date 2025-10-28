import orangeImg from '@/assets/images/orange.png';

const ProductImg = (props) => {
    const { className } = props;
    const { productImg, productName } = props;

    return (
        <>
            <img
                src={productImg || orangeImg}
                alt={productName}
                className={className || ''}
            />
        </>
    );
};

export default ProductImg;
