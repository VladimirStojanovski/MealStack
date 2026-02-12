// src/services/auth.service.ts
import axios from 'axios';
import type {IUser} from '../types/user.type';

const API_URL = `/api/auth/`;

class AuthService {

    async login(username: string, password: string): Promise<IUser> {
        const response = await axios.post(API_URL + 'login', {
            username,
            password
        });
        if (response.data.accessToken) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    }

    logout(): void {
        localStorage.removeItem('user');
    }

    async register(username: string, email: string, password: string, repeatedPassword: string): Promise<void> {
        await axios.post(API_URL + 'register', {
            username,
            email,
            password,
            repeatedPassword
        });
    }

    getCurrentUser(): IUser | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}

export default new AuthService();