import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const BrowseListings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [viewMode, setViewMode] = useState('findItems');

    // Data States
    const [myListings, setMyListings] = useState([]);
    const [feedListings, setFeedListings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [requestedListingIds, setRequestedListingIds] = useState([]);

    // --- Filter States ---
    const [searchLocation, setSearchLocation] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterMethod, setFilterMethod] = useState('All');

    // UI States
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeImgIndex, setActiveImgIndex] = useState(0);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        title: '', description: '', category: '', listingType: 'Donation',
        collectionMethod: 'Pickup', price: 0, location: '', deadline: ''
    });
    const [requestMessage, setRequestMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]); // To store preview URLs

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedUser) { navigate('/login'); return; }
        setUser(loggedUser);

        if (loggedUser.userType === 'Donor') setViewMode('myListings');
        else if (loggedUser.userType === 'Recipient') setViewMode('findItems');
        else setViewMode('findItems');

        fetchCategories();

        if (loggedUser.userType !== 'Recipient') {
            fetchMyListings(loggedUser._id);
        }

        if (loggedUser.userType !== 'Donor') {
            fetchFeedListings(loggedUser._id);
            fetchUserRequests(loggedUser._id);
        }

    }, [navigate]);

    const fetchCategories = async () => { try { const res = await axios.get('http://localhost:5000/api/categories'); setCategories(res.data); } catch (err) { console.error(err); } };
    const fetchMyListings = async (userId) => { try { const res = await axios.get(`http://localhost:5000/api/listings/my/${userId}`); setMyListings(res.data); } catch (err) { console.error(err); } };
    const fetchFeedListings = async (currentUserId) => {
        try {
            const res = await axios.get('http://localhost:5000/api/listings/feed/all');
            const filtered = res.data.filter(item => item.donor?._id !== currentUserId);
            setFeedListings(filtered);
        } catch (err) { console.error("Error fetching feed:", err); }
    };

    const fetchUserRequests = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/requests/my/${userId}`);
            const ids = res.data.map(req => (req.listingId && req.listingId._id) ? req.listingId._id : req.listingId);
            setRequestedListingIds(ids);
        } catch (err) { console.error(err); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle File Change with Preview Generation
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const isExpired = (deadline) => {
        if (!deadline) return false;
        return new Date(deadline) < new Date();
    };

    const filterListings = (listings) => {
        return listings.filter(item => {
            const loc = item.location ? item.location.toLowerCase() : "";
            const matchLocation = loc.includes(searchLocation.toLowerCase());
            const matchType = filterType === 'All' || item.listingType === filterType;
            const matchMethod = filterMethod === 'All' || item.collectionMethod === filterMethod;
            return matchLocation && matchType && matchMethod;
        });
    };

    const handleCardClick = (item) => {
        setSelectedItem(item);
        setActiveImgIndex(0);
        setShowDetailModal(true);
    };

    const handleEditClick = () => {
        if (!selectedItem) return;

        let catId = '';
        if (selectedItem.category) {
            catId = selectedItem.category._id || selectedItem.category;
        }

        setFormData({
            title: selectedItem.title,
            description: selectedItem.description,
            category: catId,
            listingType: selectedItem.listingType,
            collectionMethod: selectedItem.collectionMethod,
            price: selectedItem.price || 0,
            location: selectedItem.location,
            deadline: selectedItem.deadline ? selectedItem.deadline.split('T')[0] : ''
        });

        setImagePreviews(selectedItem.images || []);
        setIsEditing(true);
        setEditId(selectedItem._id);
        setShowDetailModal(false);
        setShowModal(true);
    };

    const handleDeleteClick = async () => {
        if (!selectedItem) return;
        Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete it!' }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/listings/delete/${selectedItem._id}`);
                    Swal.fire('Deleted!', 'Listing deleted.', 'success');
                    setShowDetailModal(false);
                    fetchMyListings(user._id);
                } catch (err) { Swal.fire('Error!', 'Failed to delete.', 'error'); }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEditing && files.length === 0) {
            return Swal.fire({
                title: 'Image Required',
                text: 'Please upload at least one image of your item.',
                icon: 'warning',
                confirmButtonColor: '#2D5A27'
            });
        }

        const data = new FormData();
        data.append('donor', user._id);
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        for (let i = 0; i < files.length; i++) data.append('listingImages', files[i]);

        try {
            let res;
            if (isEditing) res = await axios.put(`http://localhost:5000/api/listings/update/${editId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
            else res = await axios.post('http://localhost:5000/api/listings/add', data, { headers: { "Content-Type": "multipart/form-data" } });

            if (res.status === 200) {
                Swal.fire('Success!', isEditing ? 'Updated successfully.' : 'Listed successfully.', 'success');
                setShowModal(false); setFiles([]); setImagePreviews([]); setIsEditing(false); fetchMyListings(user._id);
                setFormData({ title: '', description: '', category: '', listingType: 'Donation', collectionMethod: 'Pickup', price: 0, location: '', deadline: '' });
            }
        } catch (err) { Swal.fire('Error', 'Operation failed.', 'error'); }
    };

    const handleRequestClick = (item) => { setSelectedItem(item); setShowDetailModal(false); setShowRequestModal(true); };

    const submitRequest = async () => {
        if (!requestMessage.trim()) return Swal.fire({ title: 'Error', text: 'Please enter a reason.', icon: 'warning' });

        const donorId = selectedItem.donor?._id || selectedItem.donor;
        if (!donorId) return Swal.fire({ title: 'Invalid Listing', text: 'Missing Data.', icon: 'error' });

        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone. Have you explained your need politely?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2D5A27',
            confirmButtonText: 'Yes, Send Request',
            // Add this line (increase z-index significantly)
            didOpen: () => {
                const c = document.querySelector('.swal2-container');
                if (c) c.style.zIndex = '99999';
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const requestData = { listingId: selectedItem._id, recipientId: user._id, donorId: donorId, purpose: requestMessage };
                    await axios.post('http://localhost:5000/api/requests/add', requestData);
                    setRequestedListingIds([...requestedListingIds, selectedItem._id]);
                    Swal.fire('Success', 'Request sent!', 'success');
                    setShowRequestModal(false); setRequestMessage('');
                } catch (err) { Swal.fire('Error', 'Failed.', 'error'); }
            }
        });
    };

    const openAddModal = () => {
        setFormData({ title: '', description: '', category: '', listingType: 'Donation', collectionMethod: 'Pickup', price: 0, location: '', deadline: '' });
        setIsEditing(false);
        setEditId(null);
        setFiles([]);
        setImagePreviews([]);
        setShowModal(true);
    };

    if (!user) return null;

    const filteredMyListings = filterListings(myListings);
    const filteredFeedListings = filterListings(feedListings);
    const activeMyListings = filteredMyListings.filter(item => !isExpired(item.deadline));
    const expiredMyListings = filteredMyListings.filter(item => isExpired(item.deadline));
    const canMakeRequests = user.userType === 'Recipient' || user.userType === 'Both';

    return (
        <div className="container-fluid py-5" style={{ minHeight: '100vh', backgroundColor: '#f0f4f1' }}>
            <div className="container">
                {/* Control Bar */}
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: '#1a4015' }}>{viewMode === 'myListings' ? 'Manage Your Listings' : 'Find Items'}</h2>
                        <p className="text-muted small mb-0">{viewMode === 'myListings' ? 'Track and manage your contributions.' : 'Browse available items near you.'}</p>
                    </div>
                    <div className="d-flex gap-3 align-items-center">
                        {canMakeRequests && (
                            <button className="btn text-white rounded-pill px-4 py-2 shadow fw-bold d-flex align-items-center" style={{ backgroundColor: '#198754', border: 'none' }} onClick={() => navigate('/my-requests')}>
                                <i className="bi bi-list-check me-2"></i><span>My Requests</span>
                            </button>
                        )}
                        {(user.userType === 'Donor' || user.userType === 'Both') && (
                            <button className="btn btn-warning text-dark rounded-pill px-4 py-2 shadow fw-bold d-flex align-items-center" onClick={() => navigate('/dashboard')}>
                                <i className="bi bi-grid-fill me-2"></i><span>Dashboard</span>
                            </button>
                        )}
                        {user.userType === 'Both' && (
                            <div className="bg-white p-1 rounded-pill shadow-sm border d-flex">
                                <button className={`btn rounded-pill px-4 fw-bold transition-all ${viewMode === 'myListings' ? 'text-white' : 'text-muted'}`} style={{ backgroundColor: viewMode === 'myListings' ? '#2D5A27' : 'transparent' }} onClick={() => setViewMode('myListings')}>My Listings</button>
                                <button className={`btn rounded-pill px-4 fw-bold transition-all ${viewMode === 'findItems' ? 'text-white' : 'text-muted'}`} style={{ backgroundColor: viewMode === 'findItems' ? '#2D5A27' : 'transparent' }} onClick={() => { setViewMode('findItems'); fetchFeedListings(user._id); }}>Find Items</button>
                            </div>
                        )}
                        {viewMode === 'myListings' && (
                            <button className="btn text-white rounded-pill px-4 py-2 shadow fw-bold d-flex align-items-center" style={{ backgroundColor: '#2D5A27', border: 'none' }} onClick={openAddModal}><i className="bi bi-plus-circle-fill me-2 fs-5"></i><span>Add New</span></button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-3 rounded-4 shadow-sm mb-5 border">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-4"><label className="small fw-bold text-muted mb-1 ms-2">Search Location</label><div className="input-group"><span className="input-group-text bg-light border-0"><i className="bi bi-geo-alt text-success"></i></span><input type="text" className="form-control bg-light border-0" placeholder="e.g. Colombo, Kandy..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} /></div></div>
                        <div className="col-md-3"><label className="small fw-bold text-muted mb-1 ms-2">Type (Cost)</label><select className="form-select bg-light border-0" value={filterType} onChange={(e) => setFilterType(e.target.value)}><option value="All">All Types</option><option value="Donation">Donation (Free)</option><option value="Exchange">Exchange (Paid/Value)</option></select></div>
                        <div className="col-md-3"><label className="small fw-bold text-muted mb-1 ms-2">Collection Method</label><select className="form-select bg-light border-0" value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}><option value="All">All Methods</option><option value="Pickup">Pickup</option><option value="Delivery">Delivery</option></select></div>
                        <div className="col-md-2 d-flex align-items-end"><button className="btn btn-outline-secondary w-100 rounded-pill" onClick={() => { setSearchLocation(''); setFilterType('All'); setFilterMethod('All'); }}><i className="bi bi-arrow-counterclockwise me-1"></i> Reset</button></div>
                    </div>
                </div>

                {/* --- MY LISTINGS VIEW (Donor Side) --- */}
                {viewMode === 'myListings' && (
                    <>
                        <div className="row g-4 mb-5">
                            {activeMyListings.length === 0 && expiredMyListings.length === 0 && <div className="col-12 text-center py-5 text-muted">You haven't listed any items yet (or no items match your filters).</div>}
                            {activeMyListings.map(item => (<ListingCard key={item._id} item={item} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} onClick={() => handleCardClick(item)} />))}
                        </div>
                        {expiredMyListings.length > 0 && (
                            <>
                                <h4 className="fw-bold text-secondary mb-3 pt-4 border-top"><i className="bi bi-clock-history me-2"></i>Expired Listings</h4>
                                <div className="row g-4">{expiredMyListings.map(item => (<ListingCard key={item._id} item={item} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} onClick={() => handleCardClick(item)} isExpired={true} />))}</div>
                            </>
                        )}
                    </>
                )}

                {/* --- FIND ITEMS VIEW (Recipient Side) --- */}
                {viewMode === 'findItems' && (
                    <div className="row g-4">
                        {filteredFeedListings.length === 0 && (<div className="col-12 text-center py-5"><div className="bg-white p-5 rounded-5 shadow-sm mx-auto" style={{ maxWidth: '600px' }}><i className="bi bi-search fs-1 text-muted opacity-50"></i><h4 className="fw-bold mt-3 text-dark">No Items Found</h4><p className="text-muted">No listings match your search criteria.</p></div></div>)}
                        {filteredFeedListings.map(item => (<ListingCard key={item._id} item={item} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} onClick={() => handleCardClick(item)} />))}
                    </div>
                )}

                {/* --- Detail Modal --- */}
                {showDetailModal && selectedItem && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 1055 }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                                <div className="modal-body p-0">
                                    <div className="row g-0">
                                        <div className="col-md-6 bg-light position-relative" style={{ minHeight: '400px' }}>
                                            <img src={selectedItem.images?.length > 0 ? selectedItem.images[activeImgIndex] : 'https://via.placeholder.com/400'} className="w-100 h-100 object-fit-cover" alt={selectedItem.title} style={{ filter: isExpired(selectedItem.deadline) ? 'grayscale(100%)' : 'none' }} />
                                            {isExpired(selectedItem.deadline) && <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"><h2 className="text-white fw-bold border border-white px-4 py-2 rounded">EXPIRED</h2></div>}
                                            {selectedItem.images?.length > 1 && !isExpired(selectedItem.deadline) && (
                                                <>
                                                    <button className="btn btn-dark position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle opacity-75" onClick={() => setActiveImgIndex(prev => prev === 0 ? selectedItem.images.length - 1 : prev - 1)}><i className="bi bi-chevron-left"></i></button>
                                                    <button className="btn btn-dark position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle opacity-75" onClick={() => setActiveImgIndex(prev => prev === selectedItem.images.length - 1 ? 0 : prev + 1)}><i className="bi bi-chevron-right"></i></button>
                                                </>
                                            )}
                                        </div>
                                        <div className="col-md-6 p-4 d-flex flex-column">
                                            <div className="d-flex justify-content-between mb-3">
                                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">{selectedItem.category?.name}</span>
                                                <button className="btn-close" onClick={() => setShowDetailModal(false)}></button>
                                            </div>
                                            <h3 className="fw-bold mb-2">{selectedItem.title}</h3>
                                            <div className="mb-3">
                                                <span className={`badge rounded-pill px-3 py-2 me-2 ${selectedItem.listingType === 'Donation' ? 'bg-success' : 'bg-primary'}`}>{selectedItem.listingType === 'Donation' ? 'Free Donation' : `Rs. ${selectedItem.price}`}</span>
                                                <span className="badge bg-light text-dark border">{selectedItem.collectionMethod}</span>
                                            </div>
                                            <p className="text-muted flex-grow-1" style={{ whiteSpace: 'pre-line' }}>{selectedItem.description}</p>
                                            <div className="bg-light p-3 rounded-3 mb-4">
                                                <div className="d-flex align-items-center mb-2"><i className="bi bi-geo-alt-fill text-danger me-2"></i><strong>Location:</strong> <span className="ms-1">{selectedItem.location}</span></div>
                                                {selectedItem.deadline && (<div className="d-flex align-items-center"><i className="bi bi-calendar-event-fill text-warning me-2"></i><strong>Deadline:</strong> <span className="ms-1">{new Date(selectedItem.deadline).toLocaleDateString()}</span></div>)}
                                            </div>
                                            {/* --- ACTION BUTTONS --- */}
                                            <div className="d-grid gap-2 mt-3 pt-3 border-top">
                                                {(viewMode === 'myListings' || (user && (selectedItem.donor?._id === user._id || selectedItem.donor === user._id))) ? (
                                                    <div className="d-flex gap-2">
                                                        <button className={`btn rounded-pill fw-bold flex-fill ${isExpired(selectedItem.deadline) ? 'btn-secondary disabled' : 'btn-outline-primary'}`} onClick={handleEditClick} disabled={isExpired(selectedItem.deadline)}><i className="bi bi-pencil-square me-2"></i> Edit</button>
                                                        <button className="btn btn-outline-danger rounded-pill fw-bold flex-fill" onClick={handleDeleteClick}><i className="bi bi-trash me-2"></i> Delete</button>
                                                    </div>
                                                ) : (
                                                    canMakeRequests ? (
                                                        requestedListingIds.includes(selectedItem._id) ? (
                                                            // --- Changed section request button ---
                                                            <button className="btn btn-secondary text-white rounded-pill fw-bold py-2 shadow-sm w-100 disabled" style={{ cursor: 'not-allowed', opacity: 0.8 }}>
                                                                <i className="bi bi-check-circle-fill me-2"></i> Already Requested
                                                            </button>
                                                        ) : (
                                                            <button className="btn text-white rounded-pill fw-bold py-2 shadow-sm" style={{ backgroundColor: '#2D5A27' }} onClick={() => handleRequestClick(selectedItem)}>
                                                                Request This Item <i className="bi bi-arrow-right-circle ms-2"></i>
                                                            </button>
                                                        )
                                                    ) : null
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Add/Edit Form Modal --- */}
                {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                                <div className="modal-header text-white border-0 py-3" style={{ backgroundColor: '#2D5A27' }}>
                                    <h5 className="modal-title fw-bold d-flex align-items-center"><i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>{isEditing ? 'Edit Listing' : 'Add New Listing'}</h5>
                                    <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body p-4 bg-light">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row g-4">
                                            <div className="col-md-12"><label className="form-label fw-bold text-secondary small text-uppercase">Title</label><input type="text" name="title" className="form-control rounded-3 border-0 shadow-sm p-3" value={formData.title} onChange={handleChange} required /></div>
                                            <div className="col-md-6"><label className="form-label fw-bold text-secondary small text-uppercase">Category</label><select name="category" className="form-select rounded-3 border-0 shadow-sm p-3" value={formData.category} onChange={handleChange} required><option value="">Select</option>{categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}</select></div>
                                            <div className="col-md-6"><label className="form-label fw-bold text-secondary small text-uppercase">Collection</label><select name="collectionMethod" className="form-select rounded-3 border-0 shadow-sm p-3" value={formData.collectionMethod} onChange={handleChange}><option value="Pickup">Pickup</option><option value="Delivery">Delivery</option></select></div>
                                            <div className="col-md-6"><label className="form-label fw-bold text-secondary small text-uppercase">Type</label><div className="d-flex gap-2"><div className={`flex-fill p-2 rounded-3 text-center border cursor-pointer ${formData.listingType === 'Donation' ? 'bg-success text-white border-success' : 'bg-white text-muted'}`} onClick={() => setFormData({ ...formData, listingType: 'Donation' })}>Donation</div><div className={`flex-fill p-2 rounded-3 text-center border cursor-pointer ${formData.listingType === 'Exchange' ? 'bg-primary text-white border-primary' : 'bg-white text-muted'}`} onClick={() => setFormData({ ...formData, listingType: 'Exchange' })}>Exchange</div></div></div>
                                            <div className="col-md-6"><label className="form-label fw-bold text-secondary small text-uppercase">Location</label><input type="text" name="location" className="form-control rounded-3 border-0 shadow-sm p-3" value={formData.location} onChange={handleChange} required /></div>
                                            <div className="col-md-6"><label className="form-label fw-bold text-secondary small text-uppercase">Deadline</label><input type="date" name="deadline" className="form-control rounded-3 border-0 shadow-sm p-3" value={formData.deadline} onChange={handleChange} /></div>
                                            {formData.listingType === 'Exchange' && (<div className="col-md-6"><label className="form-label fw-bold text-secondary small text-uppercase">Value (LKR)</label><input type="number" name="price" className="form-control rounded-3 border-0 shadow-sm p-3" value={formData.price} onChange={handleChange} /></div>)}
                                            <div className="col-md-12"><label className="form-label fw-bold text-secondary small text-uppercase">Description</label><textarea name="description" rows="3" className="form-control rounded-3 border-0 shadow-sm p-3" value={formData.description} onChange={handleChange} required></textarea></div>

                                            {/* --- Image Upload with Preview --- */}
                                            <div className="col-md-12">
                                                <label className="form-label fw-bold text-secondary small text-uppercase">
                                                    Images (Max 5) <span className="text-danger">*</span>
                                                </label>
                                                <div className="p-4 border-2 border-dashed border-secondary border-opacity-25 rounded-3 text-center bg-white">
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        multiple
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                    />

                                                    {/* --- Preview Container --- */}
                                                    <div className="d-flex gap-2 mt-3 flex-wrap justify-content-center">
                                                        {imagePreviews.map((src, index) => (
                                                            <div key={index} className="position-relative">
                                                                <img
                                                                    src={src}
                                                                    alt={`Preview ${index}`}
                                                                    className="rounded border object-fit-cover shadow-sm"
                                                                    style={{ width: '70px', height: '70px' }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="d-grid gap-2 mt-4 pt-3 border-top"><button type="submit" className="btn text-white rounded-pill fw-bold py-3 shadow-sm" style={{ backgroundColor: '#2D5A27' }}>{isEditing ? 'Update Listing' : 'Publish Listing'}</button><button type="button" className="btn btn-light rounded-pill fw-bold py-3 text-muted" onClick={() => setShowModal(false)}>Cancel</button></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Request Modal (Updated with Polite Message) --- */}
                {showRequestModal && selectedItem && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1070 }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content rounded-4 border-0 shadow-lg">
                                <div className="modal-header bg-success text-white">
                                    <h5 className="modal-title fw-bold">Request: {selectedItem.title}</h5>
                                    <button className="btn-close btn-close-white" onClick={() => setShowRequestModal(false)}></button>
                                </div>
                                <div className="modal-body p-4">

                                    {/* --- NEW: Polite Confirmation Message --- */}
                                    <div className="alert alert-primary border-0 bg-opacity-10 d-flex align-items-start mb-3" role="alert">
                                        <i className="bi bi-info-circle-fill text-primary me-2 mt-1"></i>
                                        <div className="small text-muted">
                                            <strong>Note:</strong> You can only send <u>one request</u> for this item. If the donor rejects it, you cannot request it again.
                                            <br />
                                            <span className="text-dark fw-bold">Tip: Be polite and explain your need clearly to increase your chances!</span>
                                        </div>
                                    </div>

                                    <label className="form-label fw-bold text-secondary small text-uppercase">Your Message</label>
                                    <textarea
                                        className="form-control rounded-3 p-3 shadow-sm border-0"
                                        rows="4"
                                        placeholder="Reason for request..."
                                        value={requestMessage}
                                        onChange={(e) => setRequestMessage(e.target.value)}
                                        style={{ backgroundColor: '#f8f9fa' }}
                                    ></textarea>
                                </div>
                                <div className="modal-footer border-0">
                                    <button className="btn btn-light rounded-pill fw-bold" onClick={() => setShowRequestModal(false)}>Cancel</button>
                                    <button className="btn btn-success rounded-pill px-4 fw-bold shadow-sm" onClick={submitRequest}>Submit Request</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ListingCard = ({ item, hoveredCard, setHoveredCard, onClick, isExpired = false }) => (
    <div className="col-md-6 col-lg-4 col-xl-3">
        <div className="card h-100 border-0 rounded-4 overflow-hidden position-relative" style={{ background: isExpired ? '#f8f9fa' : 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)', boxShadow: hoveredCard === item._id ? '0 15px 30px rgba(45, 90, 39, 0.2)' : '0 4px 15px rgba(0,0,0,0.05)', transform: hoveredCard === item._id ? 'translateY(-8px)' : 'translateY(0)', transition: 'all 0.3s ease', cursor: 'pointer', opacity: isExpired ? 0.7 : 1 }} onMouseEnter={() => setHoveredCard(item._id)} onMouseLeave={() => setHoveredCard(null)} onClick={onClick}>
            <div className="position-relative" style={{ height: '220px' }}>
                <img src={item.images?.[0] || 'https://via.placeholder.com/300x200'} className="w-100 h-100 object-fit-cover" alt={item.title} style={{ filter: isExpired ? 'grayscale(100%)' : 'none' }} />
                {isExpired && <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"><span className="badge bg-danger fs-6 px-3 py-2 shadow">EXPIRED</span></div>}
                {!isExpired && <div className="position-absolute top-0 end-0 m-3"><span className="badge bg-success shadow-sm">{item.status}</span></div>}
                <div className="position-absolute bottom-0 start-0 m-3"><span className={`badge shadow-sm rounded-pill px-3 py-2 border border-light ${item.listingType === 'Donation' ? 'bg-success text-white' : 'bg-white text-dark'}`}>{item.listingType === 'Donation' ? 'Free' : `Rs. ${item.price}`}</span></div>
            </div>
            <div className="card-body p-4"><div className="d-flex align-items-center mb-2"><i className="bi bi-tag-fill text-success me-2"></i><small className="fw-bold text-success">{item.category?.name}</small></div><h5 className="fw-bold text-dark text-truncate">{item.title}</h5><p className="small text-muted mb-0"><i className="bi bi-geo-alt-fill me-1"></i>{item.location}</p></div>
        </div>
    </div>
);

export default BrowseListings;