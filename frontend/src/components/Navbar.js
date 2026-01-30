import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();

    
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar navbar-expand-lg sticky-top custom-navbar">
            <div className="container">
                
               
                <Link className="navbar-brand d-flex align-items-center navbar-brand-text" to="/">
                    <div className="logo-circle">W2W</div>
                    Waste2Worth (W2W)
                </Link>

               
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

            
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className={`nav-link px-3 ${isActive('/') ? 'active-link' : ''}`} to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link px-3 ${isActive('/about') ? 'active-link' : ''}`} to="/about">About Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link px-3 ${isActive('/listings') ? 'active-link' : ''}`} to="/listings">Browse Listings</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link px-3 ${isActive('/how-it-works') ? 'active-link' : ''}`} to="/how-it-works">How It Works</Link>
                        </li>
                    </ul>
                </div>

                
                <div className="d-flex gap-2 align-items-center">
                    <Link to="/login" className="btn btn-login">Login</Link>
                    <Link to="/register" className="btn btn-register">Register</Link>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;