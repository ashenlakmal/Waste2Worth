import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const RecipientDashboard = () => {
    const navigate = useNavigate();
    const [myRequests, setMyRequests] = useState([]);
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [editingRequestId, setEditingRequestId] = useState(null);

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedUser) { navigate('/'); return; }
        setUser(loggedUser);
        fetchMyRequests(loggedUser._id);
    }, [navigate]);

    const fetchMyRequests = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/requests/my/${userId}`);
            setMyRequests(res.data);
        } catch (err) { console.error(err); }
    };

    const handleDeliverySubmit = async (requestId) => {
        if (!address || !phone) return Swal.fire('Error', 'Please fill all fields', 'warning');
        Swal.fire({ title: 'Confirm Details?', showCancelButton: true, confirmButtonText: 'Yes' }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/api/requests/update-delivery/${requestId}`, { deliveryAddress: address, contactNumber: phone });
                    Swal.fire('Sent!', 'Details updated.', 'success'); setEditingRequestId(null); fetchMyRequests(user._id);
                } catch (err) { Swal.fire('Error', 'Failed', 'error'); }
            }
        });
    };

    const handleConfirmReceived = async (requestId) => {
        Swal.fire({
            title: 'Item Received?',
            text: "Confirming this means you have successfully received the item. The request will be closed.",
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#2D5A27',
            confirmButtonText: 'Yes, I got it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/api/requests/action/${requestId}`, { status: 'Completed' });
                    Swal.fire('Great!', 'Transaction completed.', 'success');
                    fetchMyRequests(user._id);
                } catch (err) { Swal.fire('Error', 'Failed', 'error'); }
            }
        });
    };

    // --- FILTER LOGIC UPDATED ---
    const activeRequests = myRequests.filter(r => r.status !== 'Completed' && r.status !== 'Rejected');

    // Added Rejected items to History as well
    const historyRequests = myRequests.filter(r => r.status === 'Completed' || r.status === 'Rejected');

    return (
        <div className="container py-5" style={{ minHeight: '100vh', backgroundColor: '#f0f4f1' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#1a4015' }}>My Requests</h2>
                <button className="btn btn-outline-success rounded-pill" onClick={() => navigate('/listings')}>Back to Feed</button>
            </div>

            {/* --- ACTIVE REQUESTS SECTION --- */}
            <div className="row g-4">
                {activeRequests.length === 0 && <div className="text-center text-muted">No active requests.</div>}

                {activeRequests.map(req => (
                    <div key={req._id} className="col-lg-6">
                        <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                            <div className="d-flex align-items-center mb-3">
                                <img src={req.listingId?.images?.[0] || 'https://via.placeholder.com/80'} className="rounded-3 me-3" style={{ width: '70px', height: '70px', objectFit: 'cover' }} alt="Item" />
                                <div>
                                    <h5 className="fw-bold mb-0">{req.listingId?.title}</h5>
                                    <span className={`badge ${req.status === 'Sent' ? 'bg-info text-dark' : req.status === 'Accepted' ? 'bg-success' : 'bg-warning text-dark'}`}>{req.status}</span>
                                </div>
                            </div>

                            {req.status === 'Pending' && <div className="alert alert-warning py-2 small"><i className="bi bi-hourglass-split"></i> Waiting for approval...</div>}

                            {req.status === 'Accepted' && (
                                <div className="bg-light p-3 rounded-3 border-start border-4 border-success">
                                    <h6 className="fw-bold text-success">Approved!</h6>
                                    <div className="mb-2">
                                        <small className="text-muted">Donor Contact:</small><br />
                                        <a href={`tel:${req.donorId?.phone}`} className="fw-bold text-dark text-decoration-none fs-5">{req.donorId?.phone || "No Phone"}</a>
                                    </div>
                                    {!req.deliveryAddress ? (
                                        editingRequestId === req._id ? (
                                            <div className="bg-white p-2 rounded shadow-sm">
                                                <input className="form-control form-control-sm mb-2" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
                                                <input className="form-control form-control-sm mb-2" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                                                <button className="btn btn-success btn-sm me-2" onClick={() => handleDeliverySubmit(req._id)}>Save</button>
                                                <button className="btn btn-light btn-sm" onClick={() => setEditingRequestId(null)}>Cancel</button>
                                            </div>
                                        ) : (
                                            <button className="btn btn-outline-primary btn-sm w-100" onClick={() => { setEditingRequestId(req._id); setAddress(''); setPhone(''); }}>
                                                <i className="bi bi-truck"></i> Add Delivery Info
                                            </button>
                                        )
                                    ) : (
                                        <div className="alert alert-light border small mb-0"><i className="bi bi-check-circle"></i> Delivery details sent.</div>
                                    )}
                                </div>
                            )}

                            {req.status === 'Sent' && (
                                <div className="bg-success bg-opacity-10 p-4 rounded-3 text-center border border-success">
                                    <h5 className="text-success fw-bold"><i className="bi bi-box-seam"></i> Item Sent!</h5>
                                    <p className="small text-muted mb-3">The donor has marked this item as sent/handed over.</p>
                                    <button className="btn btn-success rounded-pill px-4 fw-bold shadow-sm" onClick={() => handleConfirmReceived(req._id)}>
                                        <i className="bi bi-check2-all me-2"></i> Confirm I Received It
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- HISTORY SECTION (Received & Rejected) --- */}
            <h5 className="fw-bold text-secondary mb-3 pt-4 border-top mt-5">History</h5>
            <div className="row g-3">
                {historyRequests.length === 0 && <div className="text-muted small">No history available.</div>}

                {historyRequests.map(req => (
                    <div key={req._id} className="col-12">
                        {/* If Status is Rejected, red style is applied, otherwise normal style */}
                        <div className={`p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center ${req.status === 'Rejected' ? 'bg-danger bg-opacity-10 border border-danger' : 'bg-white opacity-75'}`}>
                            <div className="d-flex align-items-center">
                                {/* Icon changes */}
                                {req.status === 'Rejected' ? (
                                    <i className="bi bi-x-circle-fill text-danger fs-3 me-3"></i>
                                ) : (
                                    <i className="bi bi-bag-check-fill text-success fs-3 me-3"></i>
                                )}

                                <div>
                                    <h6 className="fw-bold mb-0">{req.listingId?.title || 'Item Unavailable'}</h6>
                                    <small className="text-muted">
                                        {req.status === 'Rejected' ? 'Request Declined' : `From: ${req.donorId?.firstName}`}
                                    </small>
                                </div>
                            </div>

                            {/* Badge changes */}
                            <span className={`badge ${req.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'}`}>
                                {req.status === 'Completed' ? 'Received' : 'Rejected'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipientDashboard;