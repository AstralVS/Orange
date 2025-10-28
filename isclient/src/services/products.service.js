import instance from '@/api/axios.config';

const getProducts = async (categoryId = null) => {
    try {
        const params = categoryId ? { category_id: categoryId } : {};
        const response = await instance.get('/products', { params });

        return response;
    } catch (error) {
        console.error('Error fetching products in service:', error);
        throw error;
    }
};

const getProductById = async (productId) => {
    try {
        const response = await instance.get(`/products/${productId}`);
        return response;
    } catch (error) {
        console.error('Error fetching product by ID in service:', error);
        throw error;
    }
};

export { getProductById, getProducts };
