import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import authHeader from "../services/auth-headers";

const API_TIKTOK = "/api/download/tiktok";

const DownloadForm: React.FC = () => {
    const { user } = useAuth();

    const [inputValue, setInputValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setLoading(true);
        setError(null);
        setResponseMessage(null);

        try {
            const links = inputValue
                .split("\n")
                .map(l => l.trim())
                .filter(l => l.length > 0)
                .slice(0, 10);

            const response = await axios.post(
                API_TIKTOK,
                links,
                {
                    headers: {
                        ...authHeader(),
                        "Content-Type": "application/json"
                    },
                    responseType: "blob"
                }
            );

            const blob = new Blob([response.data], { type: "application/zip" });
            const url = window.URL.createObjectURL(blob);

            const linkElement = document.createElement("a");
            linkElement.href = url;
            linkElement.setAttribute("download", "tiktok_videos.zip");
            document.body.appendChild(linkElement);
            linkElement.click();
            linkElement.remove();

            setResponseMessage("Download started successfully.");
        } catch (err: any) {
            console.error(err);

            const backendError = err.response?.data;

            if (typeof backendError === "string") {
                setError(backendError);
            } else if (backendError?.message) {
                setError(backendError.message);
            } else {
                setError("Something went wrong while downloading.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5" style={{ maxWidth: "600px" }}>
            <div className="card shadow-sm">
                <div className="card-body p-4">
                    <h3 className="mb-4 text-center">TikTok Video Downloader</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">
                                TikTok Video Links (one per line, max 10)
                            </label>
                            <textarea
                                className="form-control"
                                rows={5}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="https://tiktok.com/@user/video/...\nhttps://tiktok.com/@user/video/..."
                                disabled={loading}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Downloading...
                                </>
                            ) : (
                                "Start Download"
                            )}
                        </button>
                    </form>

                    {responseMessage && (
                        <div className="alert alert-success mt-4">
                            {responseMessage}
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger mt-4">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DownloadForm;
