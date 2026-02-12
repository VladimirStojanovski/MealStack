// src/components/Profile.tsx
import { useAuth } from '../auth/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user.username}&background=4361ee&color=fff&size=120`}
                                    alt="profile"
                                    className="img-thumbnail rounded-circle mb-3"
                                />
                                <h3>
                                    <strong>{user.username}</strong>'s Profile
                                </h3>
                            </div>

                            <div className="mb-4">
                                <h5 className="mb-3 text-muted">Account Details</h5>
                                <div className="list-group">
                                    {user.username && (
                                        <div className="list-group-item">
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">Username:</span>
                                                <span>{user.username}</span>
                                            </div>
                                        </div>
                                    )}
                                    {user.email && (
                                        <div className="list-group-item">
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">Email:</span>
                                                <span>{user.email}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;