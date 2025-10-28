import instance from '@/api/axios.config';

const getAllCategories = async () => {
    try {
        const response = await instance.get('/categories');
        return response;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

const getCategoryById = async (categoryId) => {
    try {
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        throw error;
    }
};

const createCategory = async (categoryData) => {
    try {
        const response = await instance.post('/categories', categoryData);
        return response;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export { createCategory, getAllCategories, getCategoryById };
