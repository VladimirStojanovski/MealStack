
import axios from 'axios';
import authHeader from './auth-headers';

const API_URL = 'http://localhost:8080/api/'; // <-- matches your backend

class UserService {
    getAdminBoard() {
        return axios.get(API_URL + 'admin', { headers: authHeader() });
    }

    deleteUser(userId: number) {
        return axios.delete(`${API_URL}auth/user/${userId}`, { headers: authHeader() });
    }

    editUser(userId: number, data: { username: string; email: string; }) {
        return axios.put(`${API_URL}auth/user/${userId}`, data, { headers: authHeader() });
    }

}

export default new UserService();
