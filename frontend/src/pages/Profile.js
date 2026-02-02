import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (loggedUser) setUser(loggedUser);
        else navigate('/login');
    }, [navigate]);

    if (!user) return <div className="text-center mt-5"><div className="spinner-border text-success"></div></div>;

    return (
        <div className="container py-5" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div className="row g-4 justify-content-center">

                {/* Left Side: Profile Sidebar */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow rounded-4 text-center p-4 h-100" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #e8f5e9 100%)' }}>
                        <div className="card-body">
                            <div className="position-relative d-inline-block">
                                <img
                                    src={user.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                    className="rounded-circle border border-4 border-white shadow mb-3"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    alt="profile"
                                />
                                <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-2" style={{ width: '15px', height: '15px' }}></span>
                            </div>
                            <h4 className="fw-bold mb-1" style={{ color: '#2D5A27' }}>{user.firstName} {user.lastName}</h4>
                            <p className="text-muted small mb-3">{user.email}</p>
                            <span className="badge rounded-pill px-4 py-2 mb-4" style={{ backgroundColor: '#2D5A27' }}>{user.userType}</span>

                            <div className="mt-2 d-grid gap-2">
                                <Link to="/edit-profile" className="btn btn-success rounded-pill fw-bold shadow-sm">
                                    <i className="bi bi-pencil-square me-2"></i>Edit Profile
                                </Link>
                                <Link to="/change-password" className="btn btn-primary rounded-pill fw-bold shadow-sm">
                                    <i className="bi bi-shield-lock me-2"></i>Change Password
                                </Link>
                                <hr className="my-3" />
                                <button className="btn btn-outline-danger rounded-pill fw-bold" onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>
                                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Information Sections */}
                <div className="col-lg-7 text-start">

                    {/* 1. Personal Info Section - Light Blue/White Background */}
                    <div className="card border-0 shadow rounded-4 mb-4 overflow-hidden">
                        <div className="card-header border-0 py-3 px-4" style={{ backgroundColor: '#2D5A27', color: 'white' }}>
                            <h5 className="fw-bold mb-0"><i className="bi bi-person-badge me-2"></i>Personal Information</h5>
                        </div>
                        <div className="card-body p-4" style={{ backgroundColor: '#ffffff' }}>
                            <div className="row">
                                <div className="col-sm-6 mb-4">
                                    <label className="text-uppercase small fw-bold text-success" style={{ letterSpacing: '1px' }}>First Name</label>
                                    <p className="mb-0 fs-5 fw-medium text-dark">{user.firstName}</p>
                                </div>
                                <div className="col-sm-6 mb-4">
                                    <label className="text-uppercase small fw-bold text-success" style={{ letterSpacing: '1px' }}>Last Name</label>
                                    <p className="mb-0 fs-5 fw-medium text-dark">{user.lastName}</p>
                                </div>
                                <div className="col-sm-6 mb-4">
                                    <label className="text-uppercase small fw-bold text-success" style={{ letterSpacing: '1px' }}>Age</label>
                                    <p className="mb-0 fs-5 fw-medium text-dark">{user.age || "—"}</p>
                                </div>
                                <div className="col-sm-6 mb-4">
                                    <label className="text-uppercase small fw-bold text-success" style={{ letterSpacing: '1px' }}>Location</label>
                                    <p className="mb-0 fs-5 fw-medium text-dark"><i className="bi bi-geo-alt me-1"></i>{user.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Contact & Bio Section - Light Green Background */}
                    <div className="card border-0 shadow rounded-4 overflow-hidden">
                        <div className="card-header border-0 py-3 px-4" style={{ backgroundColor: '#f1f8f1' }}>
                            <h5 className="fw-bold mb-0" style={{ color: '#2D5A27' }}><i className="bi bi-chat-dots-fill me-2"></i>Contact & Biography</h5>
                        </div>
                        <div className="card-body p-4" style={{ backgroundColor: '#f9fdf9' }}>
                            <div className="row mb-4">
                                <div className="col-12">
                                    <label className="text-uppercase small fw-bold text-success" style={{ letterSpacing: '1px' }}>Phone Number</label>
                                    <p className="mb-0 fs-5 fw-medium"><i className="bi bi-whatsapp me-2 text-success"></i>{user.phone}</p>
                                </div>
                            </div>
                            <div className="p-3 rounded-3" style={{ backgroundColor: '#ffffff', borderLeft: '5px solid #2D5A27' }}>
                                <label className="text-uppercase small fw-bold text-muted mb-2 d-block">Biography</label>
                                <p className="mb-0 text-dark" style={{ lineHeight: '1.6' }}>
                                    {user.bio || "No biography added yet. Update your profile to tell the world about your contribution to sustainability!"}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Profile;