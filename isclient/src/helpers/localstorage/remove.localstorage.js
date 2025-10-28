const clearLocalStorage = () => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};

const removeCartItem = (itemId) => {};

export { clearLocalStorage };
