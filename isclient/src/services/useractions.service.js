import instance from '@/api/axios.config';

const recordUserAction = async (action) => {
    try {
        const response = await instance.post('/user-actions', action);
        return response;
    } catch (error) {
        console.error('Error recording user action:', error);
        throw error;
    }
};

export { recordUserAction };
