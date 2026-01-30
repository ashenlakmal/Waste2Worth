import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Login.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            Swal.fire({
                title: 'Login Successful!',
                text: `Welcome back, ${res.data.firstName}!`,
                icon: 'success',
                confirmButtonColor: '#2D5A27',
            }).then(() => {
                localStorage.setItem('user', JSON.stringify(res.data));
                navigate('/');
            });
        } catch (err) {
            Swal.fire({
                title: 'Login Failed!',
                text: 'Invalid email or password',
                icon: 'error',
                confirmButtonColor: '#d33',
            });
        }
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center">
            <div className="login-card shadow-lg d-flex flex-md-row flex-column">
                
                
                <div className="login-left p-5">
                    <h2 className="fw-bold mb-4">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <input 
                                type="email" 
                                className="form-control custom-input" 
                                placeholder="Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <input 
                                type="password" 
                                className="form-control custom-input" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-login-submit w-100 mb-3 py-2 text-white">Login</button>
                    </form>
                    <p className="mt-4 text-muted">
                        Don't have an account? <Link to="/register" className="text-success fw-bold text-decoration-none">Register</Link>
                    </p>
                </div>

                
                <div className="login-right p-5 d-flex flex-column align-items-center justify-content-center text-white">
                    <h1 className="fw-bold mb-3">Welcome Back</h1>
                    <Link to="/register" className="btn btn-register-white px-5 py-2 mt-3 fw-bold">Register</Link>
                    <p className="mt-3 small opacity-75">Switcher to register</p>
                </div>

            </div>
        </div>
    );
};

export default Login;