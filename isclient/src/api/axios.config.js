import axios from 'axios';

const API_BASE_URL = 'http://localhost:3077';

const instance = axios.create({
    baseURL: API_BASE_URL
});

instance.interceptors.request.use(
    (config) => {
        // Add any custom headers or configurations here
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        // Handle successful response
        if (response.data && response.data.data) return response.data;
        return response;
    },
    (error) => {
        // Handle response error
        if (error.response) {
            // Server responded with a status code outside of the 2xx range
            console.error('Response error:', error.response);
        } else if (error.request) {
            // Request was made but no response was received
            console.error('Request error:', error.request);
        } else {
            // Something happened in setting up the request
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default instance;
