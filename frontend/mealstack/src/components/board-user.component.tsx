// src/components/BoardUser.tsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import authHeader from "../services/auth-headers";

interface Recipe {
    id: number;
    title: string;
    description: string;
    sourceUrl?: string;
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

const TAG_THUMBNAILS: Record<Recipe["tag"], string> = {
    BREAKFAST: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9vZHxlbnwwfDJ8MHx8fDA%3D",
    LUNCH: "https://plus.unsplash.com/premium_photo-1664478288635-b9703a502393?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGZvb2R8ZW58MHwyfDB8fHww",
    DESSERT: "https://images.unsplash.com/photo-1628838617281-065549dd37fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVzc2VydHxlbnwwfDJ8MHx8fDA%3D",
    PROTEIN: "https://plus.unsplash.com/premium_photo-1723377627996-1003fa5152cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bHVuY2h8ZW58MHwyfDB8fHww\"",
    SNACK: "https://images.unsplash.com/photo-1760304356607-ecaa6826c124?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHNuYWNrfGVufDB8MnwwfHx8MA%3D%3D",
};


const API_URL = "/api/recipes";

const fallbackThumb =
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=60";

const isValidUrl = (value: string) => {
    if (!value.trim()) return true;
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const BoardUser: React.FC = () => {
    const { user } = useAuth();

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Add Recipe state
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newSourceUrl, setNewSourceUrl] = useState("");
    const [newTag, setNewTag] = useState<Recipe["tag"]>("BREAKFAST");
    const [addSubmitting, setAddSubmitting] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);

    // Edit Recipe state
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editSourceUrl, setEditSourceUrl] = useState("");
    const [editTag, setEditTag] = useState<Recipe["tag"]>("BREAKFAST");
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    // Filter
    const [filterTag, setFilterTag] = useState<Recipe["tag"] | "ALL">("ALL");

    const getPlatformIcon = (url?: string) => {
        if (!url) return "🎥";
        if (url.includes("tiktok.com")) return "🎵";
        if (url.includes("instagram.com")) return "📸";
        if (url.includes("youtube.com") || url.includes("youtu.be")) return "▶";
        return "🎥";
    };

    const getPlatformLabel = (url?: string) => {
        if (!url) return "Video";
        if (url.includes("tiktok.com")) return "TikTok";
        if (url.includes("instagram.com")) return "Instagram";
        if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
        return "Video";
    };

    const filteredRecipes = useMemo(() => {
        return recipes.filter((r) => filterTag === "ALL" || r.tag === filterTag);
    }, [recipes, filterTag]);

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

    const resetAddForm = () => {
        setNewTitle("");
        setNewDescription("");
        setNewSourceUrl("");
        setNewTag("BREAKFAST");
        setAddError(null);
    };

    const openAddModal = () => {
        setShowForm(true);
        setAddError(null);
    };

    const closeAddModal = () => {
        setShowForm(false);
        resetAddForm();
    };

    const closeEditModal = () => {
        setEditingRecipe(null);
        setEditError(null);
    };

    // --- Add Recipe ---
    const handleAddRecipe = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddError(null);

        if (!newTitle.trim() || !newDescription.trim()) {
            setAddError("Title and Description are required.");
            return;
        }
        if (!isValidUrl(newSourceUrl)) {
            setAddError("Source URL is not a valid URL.");
            return;
        }

        try {
            setAddSubmitting(true);

            const response = await axios.post(
                API_URL,
                {
                    title: newTitle.trim(),
                    description: newDescription.trim(),
                    sourceUrl: newSourceUrl.trim() || null,
                    tag: newTag,
                },
                { headers: authHeader() }
            );

            setRecipes((prev) => [response.data, ...prev]);
            setShowForm(false);
            resetAddForm();
        } catch (err) {
            console.error(err);
            setAddError("Failed to add recipe.");
        } finally {
            setAddSubmitting(false);
        }
    };

    // --- Delete Recipe ---
    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
            setRecipes((prev) => prev.filter((r) => r.id !== id));
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
        setEditTag(recipe.tag);
        setEditError(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleEditRecipe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRecipe) return;

        setEditError(null);

        if (!editTitle.trim() || !editDescription.trim()) {
            setEditError("Title and Description are required.");
            return;
        }
        if (!isValidUrl(editSourceUrl)) {
            setEditError("Source URL is not a valid URL.");
            return;
        }

        try {
            setEditSubmitting(true);

            const response = await axios.put(
                `${API_URL}/${editingRecipe.id}`,
                {
                    title: editTitle.trim(),
                    description: editDescription.trim(),
                    sourceUrl: editSourceUrl.trim() || null,
                    tag: editTag,
                },
                { headers: authHeader() }
            );

            setRecipes((prev) => prev.map((r) => (r.id === editingRecipe.id ? response.data : r)));
            setEditingRecipe(null);
        } catch (err) {
            console.error(err);
            setEditError("Failed to update recipe.");
        } finally {
            setEditSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container-fluid px-4">
            {/* Hero */}
            <div
                className="rounded-3 mb-4"
                style={{
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.06)",
                    padding: "64px 24px",
                    textAlign: "center",
                }}
            >
                <h1
                    style={{
                        fontSize: "4rem",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        marginBottom: "12px",
                        color: "#2f3a45",
                    }}
                >
                    All Recipes
                </h1>
                <p style={{ fontSize: "1.1rem", color: "#6b7280", margin: 0 }}>
                    Not sure what to cook for dinner? Browse your full library of delicious recipe ideas
                </p>
            </div>

            {/* Controls */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <button className="btn btn-success px-4" onClick={openAddModal}>
                    Add Recipe
                </button>

                <div className="d-flex align-items-center gap-2">
          <span className="fw-bold" style={{ color: "#2f3a45" }}>
            Filter by Tag:
          </span>
                    <select
                        className="form-select"
                        style={{ width: 160 }}
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

            {/* Loading/Error */}
            {loading && <p className="text-muted">Loading recipes...</p>}
            {error && <p className="text-danger">{error}</p>}

            {/* ================= ADD MODAL ================= */}
            {showForm && (
                <div
                    onClick={closeAddModal}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(17,24,39,0.55)",
                        backdropFilter: "blur(6px)",
                        zIndex: 1050,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 18,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="shadow"
                        style={{
                            width: "100%",
                            maxWidth: 860,
                            borderRadius: 16,
                            overflow: "hidden",
                            background: "#fff",
                            border: "1px solid rgba(0,0,0,0.08)",
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                padding: "18px 20px",
                                borderBottom: "1px solid rgba(0,0,0,0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>Add Recipe</div>
                                <div style={{ color: "#6b7280", fontSize: 13 }}>
                                    Add title, description, link and tag.
                                </div>
                            </div>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={closeAddModal}>
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleAddRecipe}>
                            <div className="row g-0">
                                {/* Left Preview (fallback image) */}
                                <div className="col-12 col-md-5" style={{ background: "#f3f4f6" }}>
                                    <div style={{ padding: 18 }}>
                                        <div
                                            style={{
                                                borderRadius: 14,
                                                overflow: "hidden",
                                                border: "1px solid rgba(0,0,0,0.10)",
                                                background: "#fff",
                                            }}
                                        >
                                            <div style={{ position: "relative", height: 260 }}>
                                                <img
                                                    src={TAG_THUMBNAILS[newTag] || fallbackThumb}
                                                    alt="Preview"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                                />
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        background:
                                                            "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.42) 100%)",
                                                    }}
                                                />

                                                {newSourceUrl.trim() && (
                                                    <a
                                                        href={newSourceUrl.trim()}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            position: "absolute",
                                                            right: 12,
                                                            bottom: 12,
                                                            color: "#fff",
                                                            fontWeight: 800,
                                                            textDecoration: "underline",
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        Preview link
                                                    </a>
                                                )}

                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        left: 12,
                                                        bottom: 12,
                                                        width: 34,
                                                        height: 34,
                                                        borderRadius: 999,
                                                        background: "rgba(255,255,255,0.92)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontWeight: 800,
                                                        fontSize: 12,
                                                        color: "#111827",
                                                    }}
                                                    title={getPlatformLabel(newSourceUrl)}
                                                >
                                                    {getPlatformIcon(newSourceUrl)}
                                                </div>
                                            </div>

                                            <div style={{ padding: 14 }}>
                                                <div style={{ fontWeight: 800, color: "#111827" }}>
                                                    {newTitle.trim() ? newTitle : "Recipe title…"}
                                                </div>
                                                <div style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}>
                                                    {newDescription.trim() ? newDescription : "Short description…"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Inputs */}
                                <div className="col-12 col-md-7">
                                    <div style={{ padding: 18 }}>
                                        {addError && (
                                            <div className="alert alert-danger py-2" style={{ fontSize: 14 }}>
                                                {addError}
                                            </div>
                                        )}

                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label fw-bold">Title</label>
                                                <input
                                                    className="form-control"
                                                    placeholder="e.g. High Protein Pasta"
                                                    value={newTitle}
                                                    onChange={(e) => setNewTitle(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label fw-bold">Description</label>
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Write a short note…"
                                                    rows={4}
                                                    value={newDescription}
                                                    onChange={(e) => setNewDescription(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label fw-bold">Source URL</label>
                                                <input
                                                    className={`form-control ${isValidUrl(newSourceUrl) ? "" : "is-invalid"}`}
                                                    placeholder="https://tiktok.com/... or https://instagram.com/..."
                                                    value={newSourceUrl}
                                                    onChange={(e) => setNewSourceUrl(e.target.value)}
                                                />
                                                {!isValidUrl(newSourceUrl) && (
                                                    <div className="invalid-feedback">Please enter a valid URL.</div>
                                                )}
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label fw-bold">Tag</label>
                                                <select
                                                    className="form-select"
                                                    value={newTag}
                                                    onChange={(e) => setNewTag(e.target.value as Recipe["tag"])}
                                                >
                                                    {TAG_OPTIONS.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div
                                        style={{
                                            padding: "14px 18px",
                                            borderTop: "1px solid rgba(0,0,0,0.08)",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            gap: 10,
                                        }}
                                    >
                                        <button type="button" className="btn btn-outline-secondary" onClick={closeAddModal}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={addSubmitting}>
                                            {addSubmitting ? "Adding..." : "Add Recipe"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= EDIT MODAL ================= */}
            {editingRecipe && (
                <div
                    onClick={closeEditModal}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(17,24,39,0.55)",
                        backdropFilter: "blur(6px)",
                        zIndex: 1050,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 18,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="shadow"
                        style={{
                            width: "100%",
                            maxWidth: 860,
                            borderRadius: 16,
                            overflow: "hidden",
                            background: "#fff",
                            border: "1px solid rgba(0,0,0,0.08)",
                        }}
                    >
                        <div
                            style={{
                                padding: "18px 20px",
                                borderBottom: "1px solid rgba(0,0,0,0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>Edit Recipe</div>
                                <div style={{ color: "#6b7280", fontSize: 13 }}>Update and save changes.</div>
                            </div>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={closeEditModal}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleEditRecipe}>
                            <div className="row g-0">
                                <div className="col-12 col-md-5" style={{ background: "#f3f4f6" }}>
                                    <div style={{ padding: 18 }}>
                                        <div
                                            style={{
                                                borderRadius: 14,
                                                overflow: "hidden",
                                                border: "1px solid rgba(0,0,0,0.10)",
                                                background: "#fff",
                                            }}
                                        >
                                            <div style={{ position: "relative", height: 260 }}>
                                                <img
                                                    src={TAG_THUMBNAILS[editTag] || fallbackThumb}
                                                    alt="Preview"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                                />

                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        background:
                                                            "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.42) 100%)",
                                                    }}
                                                />

                                                {editSourceUrl.trim() && (
                                                    <a
                                                        href={editSourceUrl.trim()}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            position: "absolute",
                                                            right: 12,
                                                            bottom: 12,
                                                            color: "#fff",
                                                            fontWeight: 800,
                                                            textDecoration: "underline",
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        Preview link
                                                    </a>
                                                )}

                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        left: 12,
                                                        bottom: 12,
                                                        width: 34,
                                                        height: 34,
                                                        borderRadius: 999,
                                                        background: "rgba(255,255,255,0.92)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontWeight: 800,
                                                        fontSize: 12,
                                                        color: "#111827",
                                                    }}
                                                    title={getPlatformLabel(editSourceUrl)}
                                                >
                                                    {getPlatformIcon(editSourceUrl)}
                                                </div>
                                            </div>

                                            <div style={{ padding: 14 }}>
                                                <div style={{ fontWeight: 800, color: "#111827" }}>
                                                    {editTitle.trim() ? editTitle : "Recipe title…"}
                                                </div>
                                                <div style={{ color: "#6b7280", fontSize: 13, marginTop: 6 }}>
                                                    {editDescription.trim() ? editDescription : "Short description…"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-7">
                                    <div style={{ padding: 18 }}>
                                        {editError && (
                                            <div className="alert alert-danger py-2" style={{ fontSize: 14 }}>
                                                {editError}
                                            </div>
                                        )}

                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label fw-bold">Title</label>
                                                <input
                                                    className="form-control"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label fw-bold">Description</label>
                                                <textarea
                                                    className="form-control"
                                                    rows={4}
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label fw-bold">Source URL</label>
                                                <input
                                                    className={`form-control ${isValidUrl(editSourceUrl) ? "" : "is-invalid"}`}
                                                    value={editSourceUrl}
                                                    onChange={(e) => setEditSourceUrl(e.target.value)}
                                                />
                                                {!isValidUrl(editSourceUrl) && (
                                                    <div className="invalid-feedback">Please enter a valid URL.</div>
                                                )}
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label fw-bold">Tag</label>
                                                <select
                                                    className="form-select"
                                                    value={editTag}
                                                    onChange={(e) => setEditTag(e.target.value as Recipe["tag"])}
                                                >
                                                    {TAG_OPTIONS.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            padding: "14px 18px",
                                            borderTop: "1px solid rgba(0,0,0,0.08)",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            gap: 10,
                                        }}
                                    >
                                        <button type="button" className="btn btn-outline-secondary" onClick={closeEditModal}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={editSubmitting}>
                                            {editSubmitting ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Recipes Grid */}
            <div className="row g-4 pb-4">
                {filteredRecipes.map((recipe) => {
                    const platform = getPlatformLabel(recipe.sourceUrl);

                    return (
                        <div key={recipe.id} className="col-12 col-sm-6 col-lg-3">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "14px", overflow: "hidden" }}>
                                {/* Thumbnail (fallback image) */}
                                <div style={{ position: "relative", height: 220 }}>
                                    <img
                                        src={TAG_THUMBNAILS[recipe.tag] || fallbackThumb}
                                        alt={recipe.title}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    />


                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.55) 100%)",
                                        }}
                                    />

                                    <div
                                        style={{
                                            position: "absolute",
                                            left: 12,
                                            bottom: 12,
                                            width: 34,
                                            height: 34,
                                            borderRadius: 999,
                                            background: "rgba(255,255,255,0.92)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 800,
                                            fontSize: 12,
                                            color: "#111827",
                                        }}
                                        title={platform}
                                    >
                                        {getPlatformIcon(recipe.sourceUrl)}
                                    </div>

                                    {recipe.sourceUrl && (
                                        <a
                                            href={recipe.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary btn-sm"
                                            style={{
                                                position: "absolute",
                                                right: 12,
                                                bottom: 12,
                                                fontWeight: 700,
                                                borderRadius: 8,
                                                padding: "4px 10px",
                                                fontSize: 13,
                                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                                transition: "transform 0.2s, box-shadow 0.2s",
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                                                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                                                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
                                            }}
                                        >
                                            Watch
                                        </a>
                                    )}

                                </div>

                                {/* Body */}
                                <div className="card-body" style={{ padding: "16px 16px 12px" }}>
                                    <div className="d-flex align-items-start justify-content-between gap-2">
                                        <h6 style={{ fontWeight: 800, margin: 0, lineHeight: 1.25 }}>{recipe.title}</h6>
                                        <span className="badge bg-light text-dark" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
                      {recipe.tag}
                    </span>
                                    </div>

                                    <p
                                        className="text-muted"
                                        style={{
                                            marginTop: 10,
                                            marginBottom: 0,
                                            fontSize: 13,
                                            lineHeight: 1.35,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            minHeight: 36,
                                        }}
                                    >
                                        {recipe.description || "No description provided"}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="card-footer bg-white" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "12px 16px" }}>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <small className="text-muted">{new Date(recipe.createdAt).toLocaleDateString()}</small>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => openEditModal(recipe)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(recipe.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!loading && filteredRecipes.length === 0 && (
                    <div className="col-12">
                        <div className="alert alert-light border text-center">No recipes found for this filter.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardUser;