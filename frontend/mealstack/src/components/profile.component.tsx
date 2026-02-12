// src/components/Profile.tsx
import { useAuth } from '../auth/AuthContext';
import { Navigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";
import authHeader from "../services/auth-headers.ts";

interface Recipe {
    id: number;
    title: string;
    description: string;
    sourceUrl?: string;
    createdAt: string;
    tag: "DESSERT" | "BREAKFAST" | "LUNCH" | "PROTEIN" | "SNACK";
}

const API_URL = "/api/recipes";

const Profile = () => {
    const { user } = useAuth();

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    if (!user) {
        return <Navigate to="/home" replace />;
    }

    useEffect(() => {
        if (!user) return;

        const fetchRecipes = async () => {
            try {
                const response = await axios.get<Recipe[]>(API_URL, { headers: authHeader() });
                setRecipes(response.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to load recipes");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [user]);

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
                                    {recipes && (
                                        <div className="list-group-item">
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">Saved Recipes:</span>
                                                <span>{recipes.length}</span>
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