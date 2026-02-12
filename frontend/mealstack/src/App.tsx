// src/App.tsx
import { Routes, Route, Link, NavLink, useNavigate, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardAdmin from "./components/board-admin.component";
import DownloadForm from "./components/download-videos.component";
import logo from "./assets/logo.png";

const AppContent = () => {
    const { user, isAdmin, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status" />
            </div>
        );
    }

    return (
        <div className="app-layout">
            {/* ================= NAVBAR ================= */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark meal-navbar">
                <div className="container-fluid position-relative px-4">
                    {/* LEFT: Logo */}
                    <Link to="/home" className="navbar-brand d-flex align-items-center">
                        <img src={logo} alt="MealStack" className="meal-logo" />
                    </Link>

                    {/* Mobile toggle */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        {/* CENTER NAV */}
                        <ul className="navbar-nav meal-nav-center">
                            {user && (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/user" className="nav-link">
                                            Recepies
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/download" className="nav-link">
                                            Downloader
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {isAdmin && (
                                <li className="nav-item">
                                    <NavLink to="/admin" className="nav-link">
                                        Admin
                                    </NavLink>
                                </li>
                            )}
                        </ul>

                        {/* RIGHT AUTH */}
                        <ul className="navbar-nav ms-auto align-items-lg-center">
                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/profile" className="nav-link">
                                            {user.username}
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            type="button"
                                            className="btn btn-link nav-link"
                                            onClick={handleLogout}
                                            style={{ textDecoration: "none" }}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/login" className="nav-link">
                                            Login
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/register" className="nav-link">
                                            Register
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* ================= CONTENT ================= */}
            <main className="app-main">
                <div className="container-fluid px-4 mt-4">
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/user"
                            element={
                                <ProtectedRoute>
                                    <BoardUser />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute roles={["ROLE_ADMIN"]}>
                                    <BoardAdmin />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/download"
                            element={
                                <ProtectedRoute>
                                    <DownloadForm />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </Routes>
                </div>
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="meal-footer">
                MealStack@2026, FINKI
            </footer>
        </div>
    );
};

const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;