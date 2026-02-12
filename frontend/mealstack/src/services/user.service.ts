import axios from 'axios';
import authHeader from './auth-headers';

const API_URL = '/api/';

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'test/all');
    }

    getUserBoard() {
        return axios.get(API_URL + 'test/user', { headers: authHeader() });
    }

    getModeratorBoard() {
        return axios.get(API_URL + 'test/mod', { headers: authHeader() });
    }

    getAdminBoard() {
        return axios.get(API_URL + 'admin', { headers: authHeader() });
    }

    refreshCookie() {
        return axios.post(API_URL + 'admin/refresh-cookie', {}, { headers: authHeader() });
    }
}

export default new UserService();