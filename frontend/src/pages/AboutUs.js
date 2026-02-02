import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Small component for hover changes
const GreenCard = ({ icon, title, description }) => {
    const [isHover, setIsHover] = useState(false);

    return (
        <div
            className="h-100 p-4 rounded-3 border-0 shadow-sm transition-all"
            style={{
                backgroundColor: isHover ? '#2D5A27' : '#d4edda', // Light green normally, dark green on hover
                color: isHover ? '#ffffff' : '#000000', // Font color change
                transform: isHover ? 'translateY(-10px)' : 'translateY(0)', // Lift up
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer'
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div className="mb-3">
                <i className={`bi ${icon} fs-1`} style={{ color: isHover ? '#ffffff' : '#2D5A27' }}></i>
            </div>
            <h5 className="fw-bold mb-2">{title}</h5>
            <p className="small mb-0" style={{ opacity: isHover ? 0.9 : 0.8 }}>
                {description}
            </p>
        </div>
    );
};

const AboutUs = () => {
    return (
        <div style={{ fontFamily: 'sans-serif' }}>

            {/* --- Hero Section (100% Matching Text & Style) --- */}
            <div
                className="d-flex align-items-center justify-content-center text-white text-center"
                style={{
                    height: '450px', // Set to medium height
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="container">
                    {/* Giving an Oswald-like look to match the font in the image */}
                    <h1 className="fw-bold mb-2 text-uppercase" style={{ fontSize: '3.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.6)', letterSpacing: '1px' }}>
                        TRANSFORMING WASTE INTO VALUE
                    </h1>
                    <p className="fs-4 fw-normal" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
                        Building a Sustainable Community through Sharing and Support.
                    </p>
                </div>
            </div>

            <div className="container py-5 text-center">

                {/* --- Who We Are --- */}
                <section className="mb-5">
                    <h3 className="fw-bold mb-3 text-dark">Who We Are</h3>
                    <p className="mx-auto text-dark fw-medium" style={{ maxWidth: '900px', fontSize: '15px', lineHeight: '1.6' }}>
                        Waste2Worth started with a simple observation: our homes and offices are often filled with items that we no longer use. By leveraging MERN stack technology, we have built a transparent, secure, and user-friendly ecosystem where donors and recipients can connect directly to give items a 'second life.'
                    </p>
                </section>

                {/* --- How It Works (Green Cards Section) --- */}
                <section className="mb-5">
                    <h3 className="fw-bold mb-4 text-dark">How It Works (Our Core Users)</h3>
                    <div className="row g-4 justify-content-center">

                        <div className="col-md-4">
                            <GreenCard
                                icon="bi-person-fill-check"
                                title="Donors"
                                description="Waste2Worth giving you a platform to list your surplus items for someone in need to collect."
                            />
                        </div>

                        <div className="col-md-4">
                            <GreenCard
                                icon="bi-person-heart"
                                title="Recipients"
                                description="Recipients can receive items from our donors for their use and second-hand items."
                            />
                        </div>

                        <div className="col-md-4">
                            <GreenCard
                                icon="bi-arrow-repeat"
                                title="Combined Users (Both)"
                                description="Waste2Worth and exchange their surplus according to offers and combined items."
                            />
                        </div>

                    </div>

                    {/* Read More Button */}
                    <div className="mt-4">
                        <Link
                            to="/how-it-works"
                            className="btn text-white fw-bold px-4 py-2 rounded-1 shadow-sm text-decoration-none"
                            style={{ backgroundColor: '#2D5A27', display: 'inline-block' }}
                        >
                            READ MORE
                        </Link>
                    </div>
                </section>

                {/* --- Why We Stand Out (Icons Row) --- */}
                <section className="mt-5">
                    <h3 className="fw-bold mb-5 text-dark">Why We Stand Out</h3>
                    <div className="row text-start g-4">

                        <div className="col-lg-3 col-md-6 d-flex align-items-start">
                            <i className="bi bi-leaf-fill fs-2 me-3" style={{ color: '#2D5A27' }}></i>
                            <div>
                                <h6 className="fw-bold mb-1">Environmental Impact</h6>
                                <p className="small text-muted fw-bold mb-0">Environmental impact in unique ways to reduce waste.</p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 d-flex align-items-start">
                            <i className="bi bi-patch-check-fill fs-2 me-3" style={{ color: '#2D5A27' }}></i>
                            <div>
                                <h6 className="fw-bold mb-1">Verified Community</h6>
                                <p className="small text-muted fw-bold mb-0">Verified community in our platform to ensure trust.</p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 d-flex align-items-start">
                            <i className="bi bi-geo-alt-fill fs-2 me-3" style={{ color: '#2D5A27' }}></i>
                            <div>
                                <h6 className="fw-bold mb-1">Location-Based Search</h6>
                                <p className="small text-muted fw-bold mb-0">Location based search to help you find items nearby.</p>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 d-flex align-items-start">
                            <i className="bi bi-code-square fs-2 me-3" style={{ color: '#2D5A27' }}></i>
                            <div>
                                <h6 className="fw-bold mb-1">Transparent Workflow</h6>
                                <p className="small text-muted fw-bold mb-0">Transparent workflow to maintain trust and automation.</p>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
};

export default AboutUs;