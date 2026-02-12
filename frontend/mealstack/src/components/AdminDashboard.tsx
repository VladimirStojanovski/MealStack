import { useState, useEffect } from 'react';
import UserService from '../services/user.service';
import { useAuth } from '../auth/AuthContext';
import LoadingSpinner from './LoadingSpinner'
import {Button, Table} from "react-bootstrap";
import type {IUser} from "../types/user.type";


const AdminDashboard = () => {
    const [admins, setAdmins] = useState<IUser[]>([])
    const [users, setUsers] = useState<IUser[]>([]);
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin) return;

        const fetchData = async () => {
            try {
                const usersResponse = await UserService.getAdminBoard();
                const allUsers = usersResponse.data;

                const adminUsers = allUsers.filter((user: IUser) =>
                    user.roles?.some(role => role.name === 'ROLE_ADMIN')
                );

                const normalUsers = allUsers.filter((user: IUser) =>
                    user.roles?.length === 1 && user.roles[0].name === 'ROLE_USER'
                );

                setAdmins(adminUsers)
                setUsers(normalUsers)

                console.log(adminUsers)
            } catch (error) {
                console.error("Failed to fetch admin data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAdmin]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="admin-dashboard">
            <h2 className="mb-4">Admin Dashboard</h2>

            {/* Admins Table */}
            <div className="card shadow-sm">
                <div className="card-header">
                    <h5>ADMIN Accounts</h5>
                </div>
                <div className="card-body">
                    <Table striped hover responsive bordered>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Username</th>
                            <th>Email</th>
                        </tr>
                        </thead>
                        <tbody>
                        {admins.map(admin => (
                            <tr key={admin.id}>
                                <td>{admin.id}</td>
                                <td>{admin.username}</td>
                                <td>{admin.email}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* Users Table */}
            <div className="card shadow-sm mt-5">
                <div className="card-header">
                    <h5>USER Accounts</h5>
                </div>
                <div className="card-body">
                    <Table striped hover responsive bordered>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Button variant="outline-primary" size="sm">
                                        Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm">
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;