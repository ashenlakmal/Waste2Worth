import React, { useState } from 'react';
import './Register.css'; // We will create this file next

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        location: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'Recipient'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Registration Data:", formData);
        // Next, we will connect this to your MongoDB backend!
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="left-panel">
                    <h1>Welcome Back</h1>
                    <button className="login-btn">Login</button>
                    <p>Switcher torn to login</p>
                </div>
                <div className="right-panel">
                    <h2>Register</h2>
                    <div className="role-selector">
                        <button type="button" className={formData.role === 'Recipient' ? 'active' : ''} onClick={() => setFormData({...formData, role: 'Recipient'})}>Recipient</button>
                        <button type="button" className={formData.role === 'Donor' ? 'active' : ''} onClick={() => setFormData({...formData, role: 'Donor'})}>Donor</button>
                        <button type="button" className={formData.role === 'Both' ? 'active' : ''} onClick={() => setFormData({...formData, role: 'Both'})}>Both</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-row">
                            <input name="firstName" placeholder="First Name" onChange={handleChange} />
                            <input name="lastName" placeholder="Last Name" onChange={handleChange} />
                        </div>
                        <select name="location" onChange={handleChange}>
                            <option value="">Select Location</option>
                            <option value="Colombo">Colombo</option>
                            <option value="Kandy">Kandy</option>
                        </select>
                        <input name="email" type="email" placeholder="Email" onChange={handleChange} />
                        <input name="phone" placeholder="Phone" onChange={handleChange} />
                        <div className="input-row">
                            <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                            <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} />
                        </div>
                        <button type="submit" className="create-btn">Create Account</button>
                    </form>
                    <p>Already have an account? <span className="login-link">Login</span></p>
                </div>
            </div>
        </div>
    );
};

export default Register;