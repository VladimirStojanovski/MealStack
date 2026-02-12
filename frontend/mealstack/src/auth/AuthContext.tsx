// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AuthService from '../services/auth.service';
import type {IUser} from '../types/user.type';

interface AuthContextType {
    user: IUser | null;
    isAdmin: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, password: string, repeatedPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const currentUser = AuthService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const userData = await AuthService.login(username, password);
            setUser(userData);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        AuthService.logout();
        setUser(null);
    }, []);

    const register = useCallback(async (username: string, email: string, password: string, repeatedPassword: string) => {
        setIsLoading(true);
        try {
            await AuthService.register(username, email, password, repeatedPassword);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const value = {
        user,
        isAdmin: Boolean(user?.roles?.includes('ROLE_ADMIN')),
        isLoading,
        login,
        logout,
        register
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};