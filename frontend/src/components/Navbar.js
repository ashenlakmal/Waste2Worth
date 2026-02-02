import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    // 1. State to control the logged-in user (This was added newly)
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const brandColor = { color: '#2D5A27' };

    useEffect(() => {
        // Checking if data exists in LocalStorage
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (loggedUser) {
            setUser(loggedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsDropdownOpen(false);
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
            <div className="container">
                {/* --- Logo (Same as your old way) --- */}
                <a className="navbar-brand d-flex align-items-center" href="/">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{ width: '35px', height: '35px', backgroundColor: '#2D5A27', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                        W2W
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#2D5A27' }}>Waste2Worth (W2W)</span>
                </a>

                {/* --- Links (Same as your old way) --- */}
                <div className="collapse navbar-collapse justify-content-center">
                    <ul className="navbar-nav">
                        <li className="nav-item"><a className="nav-link" href="/" style={brandColor}>Home</a></li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About Us</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/listings">Browse Listings</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/how-it-works">How It Works</Link>
                        </li>
                    </ul>
                </div>

                {/* --- Profile / Login Buttons (This is where the new changes are) --- */}
                <div className="d-flex align-items-center gap-2">
                    {user ? (
                        /* Image and name shown if logged in */
                        <div className="position-relative">
                            <div
                                className="d-flex align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <img
                                    src={user.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                    className="rounded-circle border"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                    alt="profile"
                                />
                                <div className="ms-2 text-start d-none d-sm-block">
                                    <span className="small text-muted d-block" style={{ fontSize: '10px', lineHeight: '1' }}>Welcome</span>
                                    <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>{user.firstName} {user.lastName}</span>
                                </div>
                            </div>

                            {/* Menu that appears when the image is clicked */}
                            {isDropdownOpen && (
                                <ul className="dropdown-menu dropdown-menu-end shadow border-0 show"
                                    style={{ position: 'absolute', right: 0, top: '55px', display: 'block', minWidth: '160px', zIndex: 1000 }}>
                                    <li><Link className="dropdown-item py-2" to="/profile" onClick={() => setIsDropdownOpen(false)}>View Profile</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item text-danger py-2" onClick={handleLogout}>Logout</button></li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        /* If not logged in, old buttons are shown */
                        <>
                            <Link to="/login" className="btn btn-outline-login rounded-pill px-4 transition-all btn-primary-w2w"
                                style={{ color: '#2D5A27', borderColor: '#2D5A27', fontWeight: 'bold' }}>
                                Login
                            </Link>

                            <Link to="/register" className="btn px-4 btn-primary-w2w"
                                style={{ backgroundColor: '#208411ff', borderRadius: '50px', border: 'none', fontWeight: 'bold', color: 'white' }}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;