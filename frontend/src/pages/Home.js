import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';


const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="position-relative text-white d-flex align-items-center justify-content-center text-center"
                style={{ height: '600px', backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container">
                    <h1 className="display-3 fw-bold mb-4">Turn Your Waste into <br /> Someone Else's Worth</h1>
                    <p className="lead mb-5 mx-auto opacity-90" style={{ maxWidth: '700px' }}>
                        A smart web-based platform to list, support, and exchange usable items, reduce environmental pollution and support those in need.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        {/* Start Journey Button */}
                        <Link to="/login" className="btn btn-lg px-5 py-3 text-white btn-primary-w2w shadow" style={{ backgroundColor: '#208411ff', border: 'none', borderRadius: '50px', fontWeight: 'bold' }}>
                            Start Your Journey Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission & Impact - Green Themed Modern Design */}
            <section className='border-radius 5' style={{ backgroundColor: '#1B4332' }}>
                <div className="container py-5">
                    <div className="text-center mb-5 text-white">
                        <h6 className="text-uppercase fw-bold mb-2" style={{ color: '#E8F5E9' }}>Our Goal </h6>
                        <h2 className="display-5 fw-bold">Mission & Impact </h2>
                    </div>
                    <div className="row g-4 mt-2">
                        <div className="col-md-4">
                            <div className="p-4 text-center text-white border border-light border-opacity-25 rounded-4 bg-white bg-opacity-10 modern-card h-100">
                                <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle mb-4 shadow" style={{ width: '80px', height: '80px' }}>
                                    <span className="fs-1">🗑️</span>
                                </div>
                                <h4 className="fw-bold mb-3">The Problem </h4>
                                <p className="opacity-75">Reusable items often end up in landfills due to a lack of an organized donation platform.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 text-center text-white border border-light border-opacity-25 rounded-4 bg-white bg-opacity-10 modern-card h-100">
                                <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle mb-4 shadow" style={{ width: '80px', height: '80px' }}>
                                    <span className="fs-1">💻</span>
                                </div>
                                <h4 className="fw-bold mb-3">The Solution </h4>
                                <p className="opacity-75">Waste2Worth provides a structured online space for listing and exchanging usable goods.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 text-center text-white border border-light border-opacity-25 rounded-4 bg-white bg-opacity-10 modern-card h-100">
                                <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle mb-4 shadow" style={{ width: '80px', height: '80px' }}>
                                    <span className="fs-1">🌱</span>
                                </div>
                                <h4 className="fw-bold mb-3">Key Benefits </h4>
                                <p className="opacity-75">Reduces waste, supports recycling, and strengthens community sharing.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-5" style={{ backgroundColor: '#f6fff8ff' }}>
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h6 className="text-uppercase fw-bold text-success mb-2">Capabilities </h6>
                        <h2 className="display-5 fw-bold text-dark">Features for Our Community </h2>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border-0 shadow-sm rounded-4 modern-card">
                                <div className="mb-4 bg-success bg-opacity-10 rounded-3 d-inline-block p-3">
                                    <span className="fs-2">📦</span>
                                </div>
                                <h4 className="fw-bold mb-3" style={{ color: '#2D5A27' }}>For Donors</h4>
                                <p className="text-muted small">List items, manage your profile, and approve requests based on recipient needs.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border-0 shadow-sm rounded-4 modern-card">
                                <div className="mb-4 bg-success bg-opacity-10 rounded-3 d-inline-block p-3">
                                    <span className="fs-2">🔍</span>
                                </div>
                                <h4 className="fw-bold mb-3" style={{ color: '#2D5A27' }}>For Recipients </h4>
                                <p className="text-muted small">Search active listings and submit formal requests with justification for items.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border-0 shadow-sm rounded-4 modern-card">
                                <div className="mb-4 bg-success bg-opacity-10 rounded-3 d-inline-block p-3">
                                    <span className="fs-2">⚙️</span>
                                </div>
                                <h4 className="fw-bold mb-3" style={{ color: '#2D5A27' }}>Smart Matching</h4>
                                <p className="text-muted small">Efficiently connects donors with suitable receivers to ensure items reach those in need.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;