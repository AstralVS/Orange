const isEmptyProduct = (product) => {
    if (!product) return true;
    if (typeof product !== 'object') return true;
    if (Object.keys(product).length === 0) return true;

    const requiredFields = ['id', 'name', 'price', 'category'];
    for (const field of requiredFields) {
        if (!product.hasOwnProperty(field) || !product[field]) {
            return true;
        }
    }

    return false;
};

export { isEmptyProduct };
