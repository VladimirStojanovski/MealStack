import React from "react";
import { FaUsers, FaLightbulb, FaEnvelope } from "react-icons/fa";

const AboutUs: React.FC = () => {
    return (
        <div className="about-us container mt-5 mb-5">
            {/* Page Header */}
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold">About Us</h1>
                <p className="lead text-muted">
                    Discover who we are, our vision, and how we make MealStack better every day.
                </p>
            </div>

            {/* Mission & Vision Section */}
            <div className="row text-center mb-5">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100 border-0">
                        <div className="card-body">
                            <FaLightbulb size={50} className="mb-3 text-primary" />
                            <h3 className="card-title mb-3">Our Vision</h3>
                            <p className="card-text text-muted">
                                We aim to connect people through food, inspire creativity in the kitchen,
                                and make meal planning simple and fun for everyone.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100 border-0">
                        <div className="card-body">
                            <FaUsers size={50} className="mb-3 text-primary" />
                            <h3 className="card-title mb-3">Our Mission</h3>
                            <p className="card-text text-muted">
                                To provide an easy-to-use platform for discovering, sharing, and downloading recipes,
                                empowering cooks of all levels to create delicious meals.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="mb-5">
                <h2 className="text-center mb-4">Meet Our Team</h2>
                <div className="row justify-content-center">
                    {[
                        { name: "Vladimir Stojanovski", role: "Developer" },
                        { name: "Pavel Arsovski", role: "UI/UX Designer" },
                    ].map((member) => (
                        <div key={member.name} className="col-sm-6 col-md-3 mb-4">
                            <div className="card h-100 text-center shadow-sm border-0">
                                <div className="card-body">
                                    <div className="team-avatar mb-3">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                member.name
                                            )}&background=0D6EFD&color=fff&size=128`}
                                            alt={member.name}
                                            className="rounded-circle"
                                        />
                                    </div>
                                    <h5 className="card-title">{member.name}</h5>
                                    <p className="text-muted">{member.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Section */}
            <div className="text-center">
                <h2 className="mb-3">Contact Us</h2>
                <p className="lead text-muted">
                    Have questions or suggestions? Reach out to us anytime!
                </p>
                <a
                    href="mailto:support@mealstack.com"
                    className="btn btn-primary btn-lg"
                >
                    <FaEnvelope className="me-2" />
                    Email Us
                </a>
            </div>
        </div>
    );
};

export default AboutUs;
