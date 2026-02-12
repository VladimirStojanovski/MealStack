import { useState, useEffect } from "react";
import UserService from "../services/user.service";
import { useAuth } from "../auth/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import EditUserModal from "./EditUserModal";
import type { IUser } from "../types/user.type";

const AdminDashboard = () => {
    const [admins, setAdmins] = useState<IUser[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<IUser | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditClick = (user: IUser) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    const handleUserUpdated = (updatedUser: IUser) => {
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    };

    useEffect(() => {
        if (!isAdmin) return;

        const fetchData = async () => {
            try {
                const response = await UserService.getAdminBoard();
                const allUsers = response.data;

                const adminUsers = allUsers.filter((user: IUser) =>
                    user.roles?.some((role) => role.name === "ROLE_ADMIN")
                );

                const normalUsers = allUsers.filter(
                    (user: IUser) =>
                        user.roles?.some((r) => r.name === "ROLE_USER") &&
                        !user.roles?.some((r) => r.name === "ROLE_ADMIN")
                );

                setAdmins(adminUsers);
                setUsers(normalUsers);
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAdmin]);

    const handleDelete = async (userId: number) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await UserService.deleteUser(userId);
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            alert("User deleted successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to delete user");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!isAdmin) return null;

    // --- Render Admin Card ---
    const renderAdminCard = (user: IUser) => (
        <div
            key={user.id}
            className="card shadow-sm h-100"
            style={{ borderRadius: 14, overflow: "hidden" }}
        >
            <div
                style={{
                    background: "#f9fafb",
                    padding: 16,
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
            >
                <h6 style={{ margin: 0, fontWeight: 700 }}>{user.username}</h6>
                <small className="text-muted">{user.email}</small>
                <div className="mt-2">
                    {user.roles?.map((role) => (
                        <span
                            key={role.name}
                            className="badge bg-light text-dark me-1"
                            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
                        >
              {role.name.replace("ROLE_", "")}
            </span>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid px-4">
            <h2 className="mb-4" style={{ color: "#2f3a45", fontWeight: 800 }}>
                Admin Dashboard
            </h2>

            {/* Admins Section */}
            <div className="mb-5">
                <h5 style={{ fontWeight: 700, marginBottom: 12 }}>Admin Accounts</h5>
                <div className="row g-4">
                    {admins.map((admin) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={admin.id}>
                            {renderAdminCard(admin)}
                        </div>
                    ))}
                    {admins.length === 0 && (
                        <div className="col-12">
                            <div className="alert alert-light text-center">No admins found</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="card shadow-sm">
                <div className="card-header">
                    <h5>User Accounts</h5>
                </div>
                <div className="card-body">
                    <table className="table table-striped table-hover table-bordered">
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => handleEditClick(user)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center">
                                    No users found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    onUserUpdated={handleUserUpdated}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
