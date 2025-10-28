import {
    USER_ID_STORAGE_KEY,
    USER_NAME_STORAGE_KEY
} from '@/utils/constants/keys.localstorage';

const getLoginStateLocalStorage = () =>
    !!localStorage.getItem(USER_ID_STORAGE_KEY);

const getUserNameLocalStorage = () =>
    localStorage.getItem(USER_NAME_STORAGE_KEY) || '';

const getUserIdLocalStorage = () =>
    localStorage.getItem(USER_ID_STORAGE_KEY) || null;

export {
    getLoginStateLocalStorage,
    getUserIdLocalStorage,
    getUserNameLocalStorage
};
