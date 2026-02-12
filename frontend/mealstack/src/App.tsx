// src/App.tsx
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './auth/AuthContext';
import {ProtectedRoute} from './components/ProtectedRoute';
import Login from './components/login.component';
import Register from './components/register.component';
import Home from './components/home.component';
import logo from './assets/logo.png';
import Profile from './components/profile.component';
import BoardUser from './components/board-user.component';
import BoardAdmin from './components/board-admin.component';
import DownloadForm from './components/download-videos.component';

const AppContent = () => {
    const { user, isAdmin, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link to="/home" className="navbar-brand d-flex align-items-center">
                        <img
                            src={logo}
                            alt="MealStack"
                            style={{
                                height: "36px",
                                width: "auto",
                                objectFit: "contain",
                            }}
                        />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            {user && (
                                <>
                                    <li className="nav-item">
                                        <Link to="/user" className="nav-link">
                                            User
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/download" className="nav-link">
                                            Download
                                        </Link>
                                    </li>
                                </>
                            )}
                            {isAdmin && (
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-link">
                                        Admin
                                    </Link>
                                </li>
                            )}
                        </ul>
                        <ul className="navbar-nav">
                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <Link to="/profile" className="nav-link">
                                            {user.username}
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-link" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to="/login" className="nav-link">
                                            Login
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/register" className="nav-link">
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>}/>
                    <Route path="/user" element={
                        <ProtectedRoute>
                            <BoardUser />
                        </ProtectedRoute>}/>
                    <Route path="/admin" element={
                        <ProtectedRoute roles={['ROLE_ADMIN']}>
                            <BoardAdmin />
                        </ProtectedRoute>}/>
                    <Route path="/download" element={
                        <ProtectedRoute>
                            <DownloadForm />
                        </ProtectedRoute>}/>
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </div>
        </div>
    );
};

const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;