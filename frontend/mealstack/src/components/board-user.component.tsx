// src/components/BoardUser.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../auth/AuthContext';
import authHeader from "../services/auth-headers";

interface Recipe {
    id: number;
    title: string;
    description: string;
    sourceUrl?: string;
    thumbnailUrl?: string;
    createdAt: string;
    tag: "DESSERT" | "BREAKFAST" | "LUNCH" | "PROTEIN" | "SNACK";
}

const TAG_OPTIONS: { value: Recipe["tag"]; label: string }[] = [
    { value: "BREAKFAST", label: "Breakfast" },
    { value: "LUNCH", label: "Lunch" },
    { value: "DESSERT", label: "Dessert" },
    { value: "PROTEIN", label: "Protein" },
    { value: "SNACK", label: "Snack" },
];



const API_URL = "/api/recipes";

const BoardUser: React.FC = () => {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Add Recipe Form State
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newSourceUrl, setNewSourceUrl] = useState("");
    const [newThumbnailUrl, setNewThumbnailUrl] = useState("");
    const [newTag, setNewTag] = useState<Recipe["tag"]>("BREAKFAST");

    // Edit Recipe Form State
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editSourceUrl, setEditSourceUrl] = useState("");
    const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
    const [editTag, setEditTag] = useState<Recipe["tag"]>("BREAKFAST");

    // Filter state
    const [filterTag, setFilterTag] = useState<Recipe["tag"] | "ALL">("ALL");


    const getPlatformIcon = (url?: string) => {
        if (!url) return "🎥"; // default video icon

        if (url.includes("tiktok.com")) return "🎵"; // TikTok icon
        if (url.includes("instagram.com")) return "📸"; // Instagram icon
        return "🎥"; // default
    };


    useEffect(() => {
        if (!user) return;

        const fetchRecipes = async () => {
            try {
                const response = await axios.get<Recipe[]>(API_URL, { headers: authHeader() });
                setRecipes(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load recipes");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [user]);

    // --- Add Recipe ---
    const handleAddRecipe = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, {
                title: newTitle,
                description: newDescription,
                sourceUrl: newSourceUrl,
                thumbnailUrl: newThumbnailUrl,
                tag: newTag
            }, { headers: authHeader() });


            setRecipes(prev => [...prev, response.data]);
            setShowForm(false);
            setNewTitle(""); setNewDescription(""); setNewSourceUrl(""); setNewThumbnailUrl("");
            setNewTag("BREAKFAST");
        } catch (err) {
            console.error(err);
            alert("Failed to add recipe");
        }
    };

    // --- Delete Recipe ---
    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
            setRecipes(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete recipe");
        }
    };

    // --- Edit Recipe ---
    const openEditModal = (recipe: Recipe) => {
        setEditingRecipe(recipe);
        setEditTitle(recipe.title);
        setEditDescription(recipe.description);
        setEditSourceUrl(recipe.sourceUrl || "");
        setEditThumbnailUrl(recipe.thumbnailUrl || "");
        setEditTag(recipe.tag);
    };


    const handleEditRecipe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRecipe) return;

        try {
            const response = await axios.put(`${API_URL}/${editingRecipe.id}`, {
                title: editTitle,
                description: editDescription,
                sourceUrl: editSourceUrl,
                thumbnailUrl: editThumbnailUrl,
                tag: editTag
            }, { headers: authHeader() });


            setRecipes(prev => prev.map(r => r.id === editingRecipe.id ? response.data : r));
            setEditingRecipe(null);
        } catch (err) {
            console.error(err);
            alert("Failed to update recipe");
        }
    };

    if (!user) return null;
    if (loading) return <p>Loading recipes...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Your Recipes</h2>
                <button className="btn btn-success" onClick={() => setShowForm(true)}>Add Recipe</button>

                <div className="mb-3 d-flex align-items-center gap-2">
                    <label className="mb-0 fw-bold">Filter by Tag:</label>
                    <select
                        className="form-select w-auto"
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value as Recipe["tag"] | "ALL")}
                    >
                        <option value="ALL">All</option>
                        {TAG_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            {/* Add Recipe Form */}
            {showForm && (
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">Add New Recipe</h5>
                        <form onSubmit={handleAddRecipe}>
                            <input className="form-control mb-2" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} required/>
                            <textarea className="form-control mb-2" placeholder="Description" value={newDescription} onChange={e => setNewDescription(e.target.value)} required/>
                            <input className="form-control mb-2" placeholder="Source URL" value={newSourceUrl} onChange={e => setNewSourceUrl(e.target.value)}/>
                            <input className="form-control mb-2" placeholder="Thumbnail URL" value={newThumbnailUrl} onChange={e => setNewThumbnailUrl(e.target.value)}/>
                            <select
                                className="form-select mb-2"
                                value={newTag}
                                onChange={e => setNewTag(e.target.value as Recipe["tag"])}
                            >
                                {TAG_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-secondary me-2" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Recipe</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Recipe Form */}
            {editingRecipe && (
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">Edit Recipe</h5>
                        <form onSubmit={handleEditRecipe}>
                            <input className="form-control mb-2" placeholder="Title" value={editTitle} onChange={e => setEditTitle(e.target.value)} required/>
                            <textarea className="form-control mb-2" placeholder="Description" value={editDescription} onChange={e => setEditDescription(e.target.value)} required/>
                            <input className="form-control mb-2" placeholder="Source URL" value={editSourceUrl} onChange={e => setEditSourceUrl(e.target.value)}/>
                            <input className="form-control mb-2" placeholder="Thumbnail URL" value={editThumbnailUrl} onChange={e => setEditThumbnailUrl(e.target.value)}/>
                            <select
                                className="form-select mb-2"
                                value={editTag}
                                onChange={e => setEditTag(e.target.value as Recipe["tag"])}
                            >
                                {TAG_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>


                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-secondary me-2" onClick={() => setEditingRecipe(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="row g-3">
                {recipes
                    .filter((recipe) => filterTag === "ALL" || recipe.tag === filterTag)
                    .map((recipe) => (
                    <div key={recipe.id} className="col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div
                                className="card-thumbnail d-flex align-items-center justify-content-center bg-secondary text-white"
                                style={{ height: "200px", textAlign: "center" }}
                            >
                                <div>
                                    <div style={{ fontSize: "3rem" }}>{getPlatformIcon(recipe.sourceUrl)}</div>
                                    <p style={{ fontSize: "0.9rem", margin: "0.5rem 0" }}>{recipe.title}</p>
                                    {recipe.sourceUrl && (
                                        <a
                                            href={recipe.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white"
                                            style={{ textDecoration: "underline", fontSize: "0.8rem" }}
                                        >
                                            Watch
                                        </a>
                                    )}
                                </div>
                            </div>


                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{recipe.title}</h5>
                                <p className="card-text text-truncate" style={{ flex: 1 }}>{recipe.description || "No description provided"}</p>
                                <span className="badge bg-info mb-2">
    {recipe.tag}
</span>

                                <div className="mt-3 d-flex justify-content-between">
                                    <button className="btn btn-sm btn-primary" onClick={() => openEditModal(recipe)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(recipe.id)}>Delete</button>
                                </div>
                            </div>
                            <div className="card-footer text-muted">{new Date(recipe.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BoardUser;
