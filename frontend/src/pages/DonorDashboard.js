import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const DonorDashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedUser || loggedUser.userType === 'Recipient') {
            navigate('/'); return;
        }
        setUser(loggedUser);
        fetchRequests(loggedUser._id);
    }, [navigate]);

    const fetchRequests = async (donorId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/requests/received/${donorId}`);
            setRequests(res.data);
        } catch (err) { console.error(err); }
    };

    // --- MAIN ACTION HANDLER (Approve, Reject, Mark Sent) ---
    const handleAction = async (requestId, action) => {
        let titleText = '';
        let bodyText = '';
        let btnColor = '#2D5A27';

        if (action === 'Accepted') {
            titleText = 'Approve Request?';
            bodyText = 'Are you sure you want to donate this item to this user?';
        } else if (action === 'Rejected') {
            titleText = 'Reject Request?';
            bodyText = 'This request will be declined.';
            btnColor = '#d33';
        } else if (action === 'Sent') {
            titleText = 'Confirm Handover?';
            bodyText = 'Have you sent the item via courier or handed it over directly?';
        }

        Swal.fire({
            title: titleText,
            text: bodyText,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: btnColor,
            confirmButtonText: 'Yes, Confirm'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/api/requests/action/${requestId}`, { status: action });
                    Swal.fire('Updated!', 'Status updated successfully.', 'success');
                    fetchRequests(user._id);
                } catch (err) {
                    Swal.fire('Error', 'Action failed', 'error');
                }
            }
        });
    };

    // Active Requests vs History
    const activeRequests = requests.filter(r => r.status !== 'Completed' && r.status !== 'Rejected');
    const historyRequests = requests.filter(r => r.status === 'Completed');

    return (
        <div className="container py-5" style={{ minHeight: '100vh', backgroundColor: '#f0f4f1' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#1a4015' }}>Donor Dashboard</h2>
                <button className="btn btn-outline-success rounded-pill" onClick={() => navigate('/listings')}>
                    <i className="bi bi-arrow-left me-2"></i> Back to Listings
                </button>
            </div>

            {/* --- SECTION 1: ACTIVE REQUESTS --- */}
            <h5 className="fw-bold text-secondary mb-3">Active Requests</h5>
            <div className="row">
                {activeRequests.length === 0 ? (
                    <div className="col-12 text-center py-4 bg-white rounded-4 shadow-sm mb-5">
                        <p className="text-muted mb-0">No active requests pending.</p>
                    </div>
                ) : (
                    activeRequests.map((req) => (
                        <div key={req._id} className="col-lg-6 mb-4">
                            <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                                <div className="card-body p-4">
                                    {/* Item Info */}
                                    <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                        <img src={req.listingId?.images?.[0] || 'https://via.placeholder.com/80'} className="rounded-3 me-3" style={{ width: '60px', height: '60px', objectFit: 'cover' }} alt="Item" />
                                        <div>
                                            <h6 className="fw-bold mb-0">{req.listingId?.title}</h6>
                                            <span className={`badge ${req.status === 'Accepted' ? 'bg-success' : req.status === 'Sent' ? 'bg-info text-dark' : 'bg-warning text-dark'}`}>{req.status}</span>
                                        </div>
                                    </div>

                                    {/* Recipient Info */}
                                    <div className="d-flex align-items-center mb-3 bg-light p-2 rounded-3">
                                        <img src={req.recipientId?.profileImage || 'https://via.placeholder.com/40'} className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} alt="User" />
                                        <div>
                                            <small className="d-block fw-bold">{req.recipientId?.firstName} {req.recipientId?.lastName}</small>
                                            <small className="text-muted">{req.recipientId?.phone}</small>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <p className="small text-muted fst-italic border-start border-3 border-success ps-2">"{req.purpose}"</p>

                                    {/* ACTIONS */}
                                    <div className="mt-3">
                                        {req.status === 'Pending' && (
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-success btn-sm flex-fill rounded-pill" onClick={() => handleAction(req._id, 'Accepted')}>Approve</button>
                                                <button className="btn btn-outline-danger btn-sm flex-fill rounded-pill" onClick={() => handleAction(req._id, 'Rejected')}>Reject</button>
                                            </div>
                                        )}

                                        {req.status === 'Accepted' && (
                                            <div>
                                                {req.deliveryAddress && (
                                                    <div className="alert alert-light border mb-2 small">
                                                        <strong>Delivery Address:</strong><br />
                                                        {req.deliveryAddress} <br />
                                                        Contact: {req.contactNumber}
                                                    </div>
                                                )}
                                                <button className="btn btn-dark btn-sm w-100 rounded-pill" onClick={() => handleAction(req._id, 'Sent')}>
                                                    <i className="bi bi-box-seam me-2"></i> Mark as Sent / Handed Over
                                                </button>
                                            </div>
                                        )}

                                        {req.status === 'Sent' && (
                                            <div className="alert alert-info py-2 small mb-0 text-center">
                                                <i className="bi bi-clock-history me-2"></i> Waiting for recipient to confirm receipt.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- SECTION 2: HISTORY (COMPLETED) --- */}
            <h5 className="fw-bold text-secondary mb-3 pt-4 border-top">Completed History</h5>
            <div className="row g-3">
                {historyRequests.length === 0 && <div className="text-muted small">No completed history yet.</div>}
                {historyRequests.map(req => (
                    <div key={req._id} className="col-12">
                        <div className="bg-white p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center opacity-75">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-check-circle-fill text-success fs-4 me-3"></i>
                                <div>
                                    <h6 className="fw-bold mb-0">{req.listingId?.title}</h6>
                                    <small className="text-muted">Given to: {req.recipientId?.firstName}</small>
                                </div>
                            </div>
                            <span className="badge bg-secondary">Completed</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonorDashboard;