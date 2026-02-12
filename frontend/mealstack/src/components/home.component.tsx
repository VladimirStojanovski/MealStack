// src/components/Home.tsx
import { useState, useEffect } from 'react';
import UserService from '../services/user.service';
import { Link } from 'react-router-dom';

const Home = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        UserService.getPublicContent()
            .then((response) => {
                setContent(response.data);
            })
            .catch((error) => {
                setContent(
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString()
                );
            });
    }, []);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-5">
                            <h1 className="display-4 mb-4">{content}</h1>
                            <p className="lead text-muted mb-4">
                                Welcome to BulkTok - Your TikTok video downloader
                            </p>
                            <div className="d-flex justify-content-center gap-3">
                                <Link to="/login" className="btn btn-primary btn-lg px-4">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-outline-primary btn-lg px-4">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;