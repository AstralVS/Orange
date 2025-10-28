import '@/styles/ConfirmationPopup.scss';

const ConfirmationPopup = (props) => {
    const { isOpen, onClose, totalPrice } = props;
    // const onConfirm = props;
    if (!isOpen) {
        return null;
    }

    const formatPrice = (price) => {
        if (typeof price !== 'number') return 'N/A';
        return price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

    return (
        <div className="confirmation-popup-overlay">
            <div className="confirmation-popup-content">
                <h2 className="confirmation-popup-title">
                    Payment Confirmation
                </h2>
                <p className="confirmation-popup-message">
                    Are you sure you want to pay for the items in your shopping
                    cart?
                </p>
                <p className="confirmation-popup-total">
                    Total price: <strong>{formatPrice(totalPrice)}</strong>
                </p>
                <div className="confirmation-popup-actions">
                    <button
                        className="confirmation-popup-button confirmation-popup-button-cancel"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="confirmation-popup-button confirmation-popup-button-confirm"
                        // onClick={onConfirm}
                        onClick={onClose}
                    >
                        Confirm Purchase
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
