// src/components/ProtectedRoute.tsx
import { useAuth } from '../auth/AuthContext';
import {Navigate, useLocation} from "react-router-dom";

export const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.some(role => user.roles?.includes(role))) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};