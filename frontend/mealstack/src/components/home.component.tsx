import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/logo.png';
import {useAuth} from "../auth/AuthContext.tsx";

const Home: React.FC = () => {
    const { user } = useAuth();

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                height: "100%",
                width: "100%",
                background: "#f8f9fa",
                overflow: "hidden",
                padding: "24px",
            }}
        >
            <div
                className="card shadow border-0 text-center"
                style={{
                    maxWidth: 780,
                    width: "100%",
                    padding: "3rem",
                    borderRadius: "18px",
                }}
            >
                <div
                    style={{
                        width: 200,
                        height: 200,
                        borderRadius: 22,
                        margin: "0 auto 2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={logo}
                        alt="MealStack"
                        style={{
                            width: "70%",
                            height: "70%",
                            objectFit: "contain",
                        }}
                    />
                </div>


                <h1
                    className="mb-3"
                    style={{
                        fontSize: "2.8rem",
                        fontWeight: 700,
                    }}
                >
                    Welcome to MealStack
                </h1>

                <p
                    className="text-muted mb-4"
                    style={{
                        fontSize: "1.15rem",
                        maxWidth: 520,
                        margin: "0 auto",
                    }}
                >
                    Save and organize your favorite recipe videos from TikTok, Instagram,
                    YouTube and more.
                </p>

                {!user ? (
                    <div className="d-flex justify-content-center gap-4 mt-3">
                        <Link to="/login" className="btn btn-primary btn-lg px-5">
                            Login
                        </Link>

                        <Link to="/register" className="btn btn-outline-primary btn-lg px-5">
                            Register
                        </Link>
                    </div>
                ): (
                    <div className="d-flex justify-content-center gap-4 mt-3">
                        Welcome {user.username}
                    </div>
                )

                }

            </div>

        </div>

    );
};

export default Home;