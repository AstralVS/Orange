import instance from '@/api/axios.config';

const getUserById = async (userId) => {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        console.error('getUserById: Invalid userId provided', userId);
        throw new Error('Invalid User ID format for lookup.');
    }
    try {
        const response = await instance.get(`/users/${userId}`);
        return response;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

export { getUserById };
