import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const navigate = useNavigate();

    const isStrongPassword = (pw) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pw);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Get user from LocalStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id || user?.id; // Must have either _id or id

        if (!userId) {
            return Swal.fire('Error', 'User ID not found. Please login again.', 'error');
        }

        if (!isStrongPassword(newPassword)) {
            return Swal.fire('Weak Password!', 'Must be 8+ chars, include uppercase, lowercase, number and special symbol.', 'warning');
        }

        if (newPassword !== confirmPassword) {
            return Swal.fire('Error', 'New passwords do not match!', 'error');
        }

        try {
            // Sending data to the Backend
            const res = await axios.put(`http://localhost:5000/api/change-password/${userId}`, {
                currentPassword,
                newPassword
            });

            if (res.status === 200) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Password changed successfully!',
                    icon: 'success',
                    confirmButtonColor: '#2D5A27',
                }).then(() => navigate('/profile'));
            }
        } catch (err) {
            // Displaying the actual message sent from the Backend here
            const errorMsg = err.response?.data?.message || 'Update failed! Server error.';
            Swal.fire({
                title: 'Error!',
                text: errorMsg,
                icon: 'error',
                confirmButtonColor: '#d33',
            });
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-primary text-white py-3 text-center">
                            <h5 className="mb-0 fw-bold"><i className="bi bi-shield-lock-fill me-2"></i>Secure Change Password</h5>
                        </div>
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleChangePassword}>
                                <div className="mb-3 text-start">
                                    <label className="form-label small fw-bold text-muted">Current Password</label>
                                    <input type={showPw ? "text" : "password"} className="form-control bg-light border-0 py-2" placeholder="Enter current password" required onChange={(e) => setCurrentPassword(e.target.value)} />
                                </div>
                                <div className="mb-3 text-start">
                                    <label className="form-label small fw-bold text-muted">New Password</label>
                                    <input type={showPw ? "text" : "password"} className="form-control bg-light border-0 py-2" placeholder="Enter new strong password" required onChange={(e) => setNewPassword(e.target.value)} />
                                </div>
                                <div className="mb-3 text-start">
                                    <label className="form-label small fw-bold text-muted">Confirm New Password</label>
                                    <input type={showPw ? "text" : "password"} className="form-control bg-light border-0 py-2" placeholder="Repeat new password" required onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>

                                <div className="mb-4 text-start form-check">
                                    <input type="checkbox" className="form-check-input" id="show" onChange={() => setShowPw(!showPw)} />
                                    <label className="form-check-label small text-muted" htmlFor="show">Show Passwords</label>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary rounded-pill fw-bold py-2 shadow-sm">Update Password</button>
                                    <button type="button" className="btn btn-light rounded-pill border fw-bold py-2 shadow-sm mt-1" onClick={() => navigate('/profile')}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;