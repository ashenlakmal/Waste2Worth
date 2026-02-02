import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', location: '', phone: '', age: '', bio: '' });

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (loggedUser) {
            setUser(loggedUser);
            setPreview(loggedUser.profileImage || '');
            setFormData({ firstName: loggedUser.firstName, lastName: loggedUser.lastName, location: loggedUser.location, phone: loggedUser.phone, age: loggedUser.age || '', bio: loggedUser.bio || '' });
        }
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUpdate = async (e) => {
        e.preventDefault();
        const data = new FormData();
        if (file) data.append('profileImage', file);
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        try {
            const res = await axios.put(`http://localhost:5000/api/update-profile/${user._id}`, data);
            if (res.status === 200) {
                localStorage.setItem('user', JSON.stringify(res.data));
                Swal.fire('Success', 'Profile updated!', 'success').then(() => navigate('/profile'));
            }
        } catch (err) { Swal.fire('Error', 'Update failed!', 'error'); }
    };

    if (!user) return null;

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-success text-white py-3">
                            <h4 className="mb-0 fw-bold text-center">Edit Profile</h4>
                        </div>
                        <div className="card-body p-5">
                            <form onSubmit={handleUpdate}>
                                <div className="text-center mb-5 position-relative">
                                    <div className="d-inline-block position-relative">
                                        <img src={preview} className="rounded-circle border border-4 border-light shadow" style={{ width: '130px', height: '130px', objectFit: 'cover' }} alt="preview" />
                                        <label htmlFor="upload" className="btn btn-sm btn-success rounded-circle position-absolute bottom-0 end-0 p-2 shadow">
                                            <i className="bi bi-camera-fill"></i>
                                        </label>
                                    </div>
                                    <input id="upload" type="file" className="d-none" onChange={(e) => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} />
                                    <p className="small text-muted mt-2">Click icon to change photo</p>
                                </div>

                                <div className="row g-4 text-start">
                                    <div className="col-md-6"><label className="form-label fw-bold small text-muted">First Name</label><input type="text" name="firstName" className="form-control rounded-3" value={formData.firstName} onChange={handleChange} /></div>
                                    <div className="col-md-6"><label className="form-label fw-bold small text-muted">Last Name</label><input type="text" name="lastName" className="form-control rounded-3" value={formData.lastName} onChange={handleChange} /></div>
                                    <div className="col-md-6"><label className="form-label fw-bold small text-muted">Location</label><input type="text" name="location" className="form-control rounded-3" value={formData.location} onChange={handleChange} /></div>
                                    <div className="col-md-6"><label className="form-label fw-bold small text-muted">Phone Number</label><input type="text" name="phone" className="form-control rounded-3" value={formData.phone} onChange={handleChange} /></div>
                                    <div className="col-md-4"><label className="form-label fw-bold small text-muted">Age</label><input type="number" name="age" className="form-control rounded-3" value={formData.age} onChange={handleChange} /></div>
                                    <div className="col-12"><label className="form-label fw-bold small text-muted">Bio</label><textarea name="bio" rows="3" className="form-control rounded-3" value={formData.bio} onChange={handleChange}></textarea></div>
                                </div>

                                <div className="d-flex gap-3 mt-5">
                                    <button type="submit" className="btn btn-success px-5 py-2 rounded-pill fw-bold shadow">Save Changes</button>
                                    <button type="button" className="btn btn-light px-5 py-2 rounded-pill border fw-bold shadow-sm" onClick={() => navigate('/profile')}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;