import instance from '@/api/axios.config';

const getRecommendations = async (userId) => {
    if (!userId) {
        return Promise.reject(
            new Error('User ID is required for recommendations.')
        );
    }

    try {
        const response = await instance.get(`/recommendation/${userId}`);

        return response;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
};

export { getRecommendations };
