import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 1. State for mobile nav toggle
    const [isNavOpen, setIsNavOpen] = useState(false);

    const navigate = useNavigate();
    const brandColor = { color: '#2D5A27' };

    useEffect(() => {
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

    // toggle Nav for mobile menu
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    // close Nav after clicking a link
    const closeNav = () => {
        setIsNavOpen(false);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
            <div className="container">
                {/* --- Logo --- */}
                <a className="navbar-brand d-flex align-items-center" href="/">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{ width: '35px', height: '35px', backgroundColor: '#2D5A27', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                        W2W
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#2D5A27' }}>Waste2Worth (W2W)</span>
                </a>

                {/* --- 2. Toggler Button (Mobile Hamburger Menu) --- */}
                <button
                    className="navbar-toggler shadow-none border-0"
                    type="button"
                    onClick={toggleNav}
                    aria-expanded={isNavOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* --- 3. Collapsible Content (Links & User Profile) --- */}
                <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">

                    {/* Centered Links */}
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 text-center">
                        <li className="nav-item">
                            <a className="nav-link" href="/" style={brandColor} onClick={closeNav}>Home</a>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about" onClick={closeNav}>About Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/listings" onClick={closeNav}>Browse Listings</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/how-it-works" onClick={closeNav}>How It Works</Link>
                        </li>
                    </ul>

                    {/* Profile / Login Buttons (Responsive Alignment) */}
                    <div className="d-flex flex-column flex-lg-row align-items-center gap-3 justify-content-center mt-3 mt-lg-0">
                        {user ? (
                            <div className="position-relative">
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <img
                                        src={user.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                        className="rounded-circle border"
                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                        alt="profile"
                                    />
                                    <div className="ms-2 text-start">
                                        <span className="small text-muted d-block" style={{ fontSize: '10px', lineHeight: '1' }}>Welcome</span>
                                        <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>{user.firstName} {user.lastName}</span>
                                    </div>
                                </div>

                                {isDropdownOpen && (
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 show text-center text-lg-start"
                                        style={{ position: 'absolute', right: 0, left: 'auto', top: '55px', minWidth: '160px', zIndex: 1000 }}>
                                        <li><Link className="dropdown-item py-2" to="/profile" onClick={() => { setIsDropdownOpen(false); closeNav(); }}>View Profile</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><button className="dropdown-item text-danger py-2" onClick={handleLogout}>Logout</button></li>
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline-login rounded-pill px-4 transition-all btn-primary-w2w"
                                    style={{ color: '#2D5A27', borderColor: '#2D5A27', fontWeight: 'bold' }}
                                    onClick={closeNav}>
                                    Login
                                </Link>

                                <Link to="/register" className="btn px-4 btn-primary-w2w"
                                    style={{ backgroundColor: '#208411ff', borderRadius: '50px', border: 'none', fontWeight: 'bold', color: 'white' }}
                                    onClick={closeNav}>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;