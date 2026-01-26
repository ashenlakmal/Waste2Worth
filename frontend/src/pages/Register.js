import React, { useState } from 'react';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', location: '', email: '', phone: '', password: '', confirmPassword: '', role: 'Recipient'
    });

    return (
        <div className="register-wrapper d-flex justify-content-center align-items-center bg-light">
            <div className="register-container row shadow rounded-5 overflow-hidden bg-white">
                { }
                <div className="col-md-5 d-flex flex-column justify-content-center align-items-center text-white p-5 bg-w2w-green">
                    <h1 className="fw-bold mb-4 display-5 text-center">Welcome Back</h1>
                    <button className="btn btn-light rounded-pill px-5 py-2 fw-bold text-success fs-5">Login</button>
                    <p className="mt-4 small opacity-75">Switcher torn to login</p>
                </div>

                { }
                <div className="col-md-7 p-5">
                    <h2 className="fw-bold mb-4 display-6">Register</h2>
                    <div className="btn-group w-75 mb-4 custom-role-toggle">
                        {['Recipient', 'Donor', 'Both'].map((r) => (
                            <button key={r} className={`btn rounded-pill px-4 ${formData.role === r ? 'btn-w2w-green text-white' : 'btn-light text-dark'}`} 
                                onClick={() => setFormData({...formData, role: r})}>{r}</button>
                        ))}
                    </div>
                    <form className="row g-3">
                        <div className="col-md-6"><input className="form-control rounded-pill p-3" placeholder="First Name" /></div>
                        <div className="col-md-6"><input className="form-control rounded-pill p-3" placeholder="Last Name" /></div>
                        <div className="col-12"><select className="form-select rounded-pill p-3 text-muted"><option>Select Location</option></select></div>
                        <div className="col-12"><input className="form-control rounded-pill p-3" placeholder="Email" /></div>
                        <div className="col-12"><input className="form-control rounded-pill p-3" placeholder="Phone" /></div>
                        <div className="col-md-6"><input className="form-control rounded-pill p-3" placeholder="Password" /></div>
                        <div className="col-md-6"><input className="form-control rounded-pill p-3" placeholder="Confirm Password" /></div>
                        <div className="col-12 mt-4"><button className="btn btn-w2w-green w-100 rounded-pill py-3 text-white fw-bold fs-5">Create Account</button></div>
                    </form>
                    <p className="text-center mt-3 small">Already have an account? <span className="text-success fw-bold">Login</span></p>
                </div>
            </div>
        </div>
    );
};
export default Register;