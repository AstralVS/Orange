import ConfirmationPopup from '@/components/compts.pages/cart.page.compts/ConfirmationPopup';
import '@/styles/cart.page.scss';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState('');

    useEffect(() => {
        const loadedCartItems = JSON.parse(
            localStorage.getItem('cartItems') || '[]'
        );
        setCartItems(loadedCartItems);
        setCurrentUserId(localStorage.getItem('userId'));
    }, []);

    const updateLocalStorageAndState = (newCartItems) => {
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        setCartItems(newCartItems);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedCartItems = cartItems.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        updateLocalStorageAndState(updatedCartItems);
    };

    const handleRemoveItem = (productId) => {
        const updatedCartItems = cartItems.filter(
            (item) => item.id !== productId
        );
        updateLocalStorageAndState(updatedCartItems);
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const handleOpenCheckoutPopup = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        setIsPopupOpen(true);
    };

    const handleCloseCheckoutPopup = () => {
        setIsPopupOpen(false);
    };

    // const handleConfirmPurchase = async () => {
    //     if (!currentUserId) {
    //         alert('Please log in to complete payment and record action.');
    //         setIsPopupOpen(false);
    //         return;
    //     }

    //     console.log('Processing purchase for user:', currentUserId);
    //     const purchasePromises = cartItems.map((item) => {
    //         return recordUserAction({
    //             user_id: currentUserId,
    //             product_id: item.id,
    //             action_type: 'PURCHASE'
    //         });
    //     });

    //     try {
    //         await Promise.all(purchasePromises);
    //         console.log('All PURCHASE actions recorded successfully.');
    //         alert('Payment successful! Thank you for your purchase.');

    //         localStorage.removeItem('cartItems');
    //         setCartItems([]);
    //     } catch (error) {
    //         console.error(
    //             'An error occurred while recording purchase actions.',
    //             error
    //         );
    //         alert('An error occurred during processing. Please try again.');
    //     } finally {
    //         setIsPopupOpen(false);
    //     }
    // };

    const formatPrice = (price) => {
        if (typeof price !== 'number') return 'N/A';
        return price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

    return (
        <div className="cart-page-container">
            <h1 className="cart-page-title">Your Cart</h1>
            {cartItems.length === 0 ? (
                <div className="cart-empty-message">
                    <p>Your shopping cart is currently empty.</p>
                    <Link to="/" className="cart-back-to-shop-link">
                        Continue shopping
                    </Link>
                </div>
            ) : (
                <>
                    <div className="cart-items-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img
                                    src={
                                        item.image_url ||
                                        'https://png.pngtree.com/png-clipart/20250104/original/pngtree-orange-slice-half-cut-png-image_18733135.png'
                                    }
                                    alt={item.name}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-details">
                                    <h3 className="cart-item-name">
                                        {item.name}
                                    </h3>
                                    <p className="cart-item-price-single">
                                        {formatPrice(item.price)}
                                    </p>
                                </div>
                                <div className="cart-item-quantity-controls">
                                    <button
                                        onClick={() =>
                                            handleQuantityChange(
                                                item.id,
                                                item.quantity - 1
                                            )
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() =>
                                            handleQuantityChange(
                                                item.id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="cart-item-total-price">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                                <button
                                    className="cart-item-remove-button"
                                    onClick={() => handleRemoveItem(item.id)}
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2 className="cart-summary-title">Total</h2>
                        <p className="cart-summary-total-price">
                            {formatPrice(calculateTotalPrice())}
                        </p>
                        <button
                            className="cart-checkout-button"
                            onClick={handleOpenCheckoutPopup}
                        >
                            Make Payment
                        </button>
                    </div>
                </>
            )}
            <ConfirmationPopup
                isOpen={isPopupOpen}
                onClose={handleCloseCheckoutPopup}
                // onConfirm={handleConfirmPurchase}
                totalPrice={calculateTotalPrice()}
            />
        </div>
    );
};

export default CartPage;
