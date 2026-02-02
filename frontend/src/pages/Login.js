import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/login', { email, password });

            Swal.fire({
                title: 'Login Successful!',
                text: `Welcome back, ${res.data.firstName}!`,
                icon: 'success',
                confirmButtonColor: '#2D5A27',
            }).then(() => {
                // Save user details to LocalStorage
                localStorage.setItem('user', JSON.stringify(res.data));

                window.location.href = "/";
            });
        } catch (err) {
            Swal.fire({
                title: 'Login Failed!',
                text: err.response?.data?.message || 'Email or Password incorrect!',
                icon: 'error',
                confirmButtonColor: '#d33',
            });
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f0f2f0' }}>
            <div className="row shadow-lg rounded-4 overflow-hidden" style={{ width: '900px', minHeight: '500px' }}>

                {/* Login Form */}
                <div className="col-md-5 bg-white p-5 d-flex flex-column justify-content-center text-start">
                    <h2 className="fw-bold mb-4 text-dark">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control rounded-3 py-2 border-secondary border-opacity-25"
                                placeholder="Email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                className="form-control rounded-3 py-2 border-secondary border-opacity-25"
                                placeholder="Password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn w-100 text-white fw-bold py-2 rounded-3 shadow-sm" style={{ backgroundColor: '#2D5A27' }}>
                            Login
                        </button>
                    </form>
                    <p className="text-center mt-4 small text-muted">
                        Don't have an account? <Link to="/register" className="text-success fw-bold text-decoration-none">Register</Link>
                    </p>
                </div>

                {/* Right Side Green Panel */}
                <div className="col-md-7 d-flex flex-column align-items-center justify-content-center text-white p-5" style={{ backgroundColor: '#2D5A27' }}>
                    <h1 className="fw-bold mb-4">Welcome Back</h1>
                    <Link to="/register" className="btn btn-light rounded-pill px-5 py-2 fw-bold mb-3 shadow-sm text-dark text-decoration-none">
                        Register
                    </Link>
                    <p className="small opacity-75">Switcher to register</p>
                </div>
            </div>
        </div>
    );
};

export default Login;