import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const brandColor = { color: '#2D5A27' };
    const btnPrimary = { backgroundColor: '#2D5A27', color: 'white', borderRadius: '50px' };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
            <div className="container">
                <a className="navbar-brand d-flex align-items-center" href="/">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{ width: '35px', height: '35px', backgroundColor: '#2D5A27', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                        W2W
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#2D5A27' }}>Waste2Worth (W2W)</span>
                </a>
                <div className="collapse navbar-collapse justify-content-center">
                    <ul className="navbar-nav">
                        <li className="nav-item"><a className="nav-link active border-bottom border-success border-2" href="/" style={brandColor}>Home</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">About Us</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Browse Listings</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">How It Works</a></li>
                    </ul>
                </div>
                <div className="d-flex gap-2">
                    {/* Navbar එකේ ඇති Login button එකට මෙම class එක එක් කරන්න */}
                    <Link to="/login" className="btn btn-outline-login rounded-pill px-4 transition-all btn-primary-w2w" style={{ color: '#2D5A27', borderColor: '#2D5A27', fontWeight: 'bold' }}>
                        Login
                    </Link>

                    <Link to="/register" className="btn px-4 btn-primary-w2w" style={{ backgroundColor: '#208411ff', borderRadius: '50px', border: 'none', fontWeight: 'bold', color: 'white' }}>
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;