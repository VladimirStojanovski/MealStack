import { useState, useEffect } from 'react';
import UserService from '../services/user.service';
import { useAuth } from '../auth/AuthContext';
import AdminDashboard from "./AdminDashboard";

const BoardAdmin = () => {
    const [content, setContent] = useState('');
    const { isAdmin } = useAuth();

    useEffect(() => {
        if (!isAdmin) return;

        UserService.getAdminBoard()
            .then((response) => {
                setContent(response.data);
            })
            .catch((error) => {
                const resMessage =
                    (error.response?.data?.message) ||
                    error.message ||
                    error.toString();
                setContent(resMessage);
            });
    }, [isAdmin]);

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="container">
            <AdminDashboard></AdminDashboard>
        </div>
    );
};

export default BoardAdmin;