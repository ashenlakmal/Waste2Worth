import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        location: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [userType, setUserType] = useState('Recipient');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getButtonStyle = (type) => {
        return userType === type
            ? { backgroundColor: '#2D5A27', color: 'white' }
            : { backgroundColor: 'transparent', color: '#333' };
    };

    const isStrongPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return Swal.fire({
                title: 'Error!',
                text: 'Passwords do not match!',
                icon: 'warning',
                confirmButtonColor: '#d33',
            });
        }

        if (!isStrongPassword(formData.password)) {
            return Swal.fire({
                title: 'Weak Password!',
                text: 'Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.',
                icon: 'info',
                confirmButtonColor: '#2D5A27',
            });
        }

        const dataToSend = {
            ...formData,
            userType: userType
        };

        try {
            const response = await axios.post('http://localhost:5000/api/register', dataToSend);

            if (response.status === 200) {
                Swal.fire({
                    title: 'Registration Successful!',
                    text: 'You can Login Now!',
                    icon: 'success',
                    confirmButtonColor: '#2D5A27',
                }).then(() => {
                    navigate('/login');
                });
            }
        } catch (error) {
            let errorMsg = 'Registration Unsuccessful! Please try again!';
            if (error.response?.status === 400 || error.response?.status === 409) {
                errorMsg = 'This email is already registered!';
            }

            Swal.fire({
                title: 'Error!',
                text: errorMsg,
                icon: 'error',
                confirmButtonColor: '#d33',
            });
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f0f2f0' }}>
            <div className="row shadow-lg rounded-4 overflow-hidden" style={{ width: '900px', minHeight: '600px' }}>

                <div className="col-md-5 d-flex flex-column align-items-center justify-content-center text-white p-5" style={{ backgroundColor: '#2D5A27' }}>
                    <h1 className="fw-bold mb-4">Welcome Back</h1>
                    <Link to="/login" className="btn btn-light rounded-pill px-5 py-2 fw-bold mb-3 shadow-sm">Login</Link>
                    <p className="small opacity-75">Switcher torn to login</p>
                </div>

                <div className="col-md-7 bg-white p-5 text-start overflow-auto" style={{ maxHeight: '100vh' }}>
                    <h2 className="fw-bold mb-4 text-dark">Register</h2>

                    <div className="d-flex bg-light rounded-pill p-1 mb-4 shadow-sm" style={{ width: 'fit-content' }}>
                        <button type="button" className="btn rounded-pill px-3 py-1 border-0 transition-all" style={getButtonStyle('Recipient')} onClick={() => setUserType('Recipient')}>Recipient</button>
                        <button type="button" className="btn rounded-pill px-3 py-1 border-0 transition-all" style={getButtonStyle('Donor')} onClick={() => setUserType('Donor')}>Donor</button>
                        <button type="button" className="btn rounded-pill px-3 py-1 border-0 transition-all" style={getButtonStyle('Both')} onClick={() => setUserType('Both')}>Both</button>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <input type="text" name="firstName" className="form-control rounded-3 py-2 border-secondary border-opacity-25" placeholder="First Name" required onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <input type="text" name="lastName" className="form-control rounded-3 py-2 border-secondary border-opacity-25" placeholder="Last Name" required onChange={handleChange} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <select name="location" className="form-select rounded-3 py-2 border-secondary border-opacity-25" required onChange={handleChange}>
                                <option value="">Select Location</option>
                                <option value="Colombo">Colombo</option>
                                <option value="Kandy">Kandy</option>
                                <option value="Badulla">Badulla</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <input type="email" name="email" className="form-control rounded-3 py-2 border-secondary border-opacity-25" placeholder="Email" required onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <input type="tel" name="phone" className="form-control rounded-3 py-2 border-secondary border-opacity-25" placeholder="Phone" required onChange={handleChange} />
                        </div>

                        {/* Password Section */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <input type="password" name="password" className="form-control rounded-3 py-2 border-secondary border-opacity-25" placeholder="Password" required onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <input type="password" name="confirmPassword" className="form-control rounded-3 py-2 border-secondary border-opacity-25" placeholder="Confirm Password" required onChange={handleChange} />
                            </div>
                        </div>

                        <button type="submit" className="btn w-100 text-white fw-bold py-2 rounded-3 shadow-sm mt-2" style={{ backgroundColor: '#2D5A27' }}>
                            Create Account
                        </button>
                    </form>

                    <p className="text-center mt-4 small text-muted">
                        Already have an account? <Link to="/login" className="text-success fw-bold text-decoration-none">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;