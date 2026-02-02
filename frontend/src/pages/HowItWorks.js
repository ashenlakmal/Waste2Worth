import React, { useState } from 'react';

// Step card with Hover Effect (Reusable Component)
const StepCard = ({ number, icon, title, description }) => {
    const [isHover, setIsHover] = useState(false);

    return (
        <div
            className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 transition-all"
            style={{
                backgroundColor: isHover ? '#2D5A27' : '#ffffff', // Dark green on Hover
                color: isHover ? '#ffffff' : '#000000',
                transform: isHover ? 'translateY(-10px)' : 'translateY(0)',
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer'
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {/* Number Badge */}
            <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fw-bold fs-5"
                style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: isHover ? '#ffffff' : '#2D5A27', // White on Hover, otherwise green
                    color: isHover ? '#2D5A27' : '#ffffff',
                    position: 'absolute',
                    top: '-20px',
                    left: '20px'
                }}
            >
                {number}
            </div>

            <div className="mb-3 mt-2">
                <i className={`bi ${icon} display-4`} style={{ color: isHover ? '#ffffff' : '#2D5A27' }}></i>
            </div>
            <h5 className="fw-bold mb-3">{title}</h5>
            <p className="small mb-0" style={{ opacity: isHover ? 0.9 : 0.7 }}>
                {description}
            </p>
        </div>
    );
};

const HowItWorks = () => {
    return (
        <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9' }}>

            {/* --- 1. Hero Section (100% Matching Image) --- */}
            <div
                className="d-flex align-items-center justify-content-center text-white text-center"
                style={{
                    height: '350px',
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80')", // Eco-friendly/Recycling image
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="container">
                    <h1 className="fw-bold display-4 text-uppercase mb-2" style={{ letterSpacing: '2px' }}>
                        HOW IT WORKS
                    </h1>
                    <p className="fs-5 fw-light">
                        Our Mission: Turning waste into worth, one item at a time.
                    </p>
                </div>
            </div>

            <div className="container py-5">

                {/* --- 2. For Donors Section --- */}
                <h2 className="fw-bold text-center mb-5" style={{ color: '#2D5A27' }}>For Donors</h2>
                <div className="row g-4 mb-4">
                    <div className="col-md-4 position-relative mt-5 mt-md-0">
                        <StepCard
                            number="1"
                            icon="bi-camera-fill"
                            title="List"
                            description="Snap a few photos and describe your item."
                        />
                    </div>
                    <div className="col-md-4 position-relative mt-5 mt-md-0">
                        <StepCard
                            number="2"
                            icon="bi-file-text-fill"
                            title="Review"
                            description="Check incoming requests and the 'Purpose' of each recipient."
                        />
                    </div>
                    <div className="col-md-4 position-relative mt-5 mt-md-0">
                        <StepCard
                            number="3"
                            icon="bi-hand-thumbs-up-fill"
                            title="Approve"
                            description="Accept the best request to share contact details and finalize the handover."
                        />
                    </div>
                </div>

                {/* Donors Details Text */}
                <div className="mb-5 p-4 bg-white rounded-3 shadow-sm border-start border-5 border-success">
                    <p className="mb-2 text-dark small">
                        <strong>Approve & Connect:</strong> Once you click 'Accept', the system automatically notifies the recipient and closes the listing for others.
                    </p>
                    <p className="mb-0 text-dark small">
                        <strong>Finalize Handover:</strong> Coordinate the collection (Physical meet-up or Delivery) using the contact details provided after approval.
                    </p>
                </div>

                <hr className="my-5" style={{ borderColor: '#2D5A27', opacity: 0.2 }} />

                {/* --- 3. For Recipients Section --- */}
                <h2 className="fw-bold text-center mb-5" style={{ color: '#2D5A27' }}>For Recipients</h2>
                <div className="row g-4 mb-4">
                    <div className="col-md-4 position-relative mt-5 mt-md-0">
                        <StepCard
                            number="1"
                            icon="bi-funnel-fill"
                            title="Search"
                            description="Use filters to find items you need in your local area."
                        />
                    </div>
                    <div className="col-md-4 position-relative mt-5 mt-md-0">
                        <StepCard
                            number="2"
                            icon="bi-pencil-square"
                            title="Request"
                            description="Submit a formal request with a brief explanation of your need."
                        />
                    </div>
                    <div className="col-md-4 position-relative mt-5 mt-md-0">
                        <StepCard
                            number="3"
                            icon="bi-truck"
                            title="Collect"
                            description="Once approved, receive the donor's info to arrange pickup or delivery."
                        />
                    </div>
                </div>

                {/* Recipients Details Text */}
                <div className="mb-5 p-4 bg-white rounded-3 shadow-sm border-start border-5 border-success">
                    <p className="mb-2 text-dark small">
                        <strong>Submit a Request:</strong> When you find an item, click 'Request This Item.' You must provide a valid 'Purpose' or justification for your request.
                    </p>
                    <p className="mb-2 text-dark small">
                        <strong>Wait for Approval:</strong> The donor will review your request. You can track the status (Pending/Accepted/Rejected) on your dashboard.
                    </p>
                    <p className="mb-2 text-dark small">
                        <strong>Receive Notification:</strong> If accepted, you will receive the donor's contact information and location to arrange the handover.
                    </p>
                    <p className="mb-0 text-dark small">
                        <strong>Confirm Collection:</strong> Once you receive the item, the transaction is marked as complete.
                    </p>
                </div>

                {/* --- 4. The Result & Safety Section --- */}
                <div className="row g-5 mt-2">
                    <div className="col-lg-12 text-center">
                        <h4 className="fw-bold text-dark">The Result</h4>
                        <p className="text-muted">Items stay out of landfills, and resources go to those who value them most. Simple, transparent, and sustainable.</p>
                    </div>

                    <div className="col-lg-12">
                        <h4 className="fw-bold mb-3" style={{ color: '#000000' }}>Our Safety & Community Standards</h4>
                        <ul className="list-unstyled">
                            <li className="d-flex mb-3">
                                <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                                <div>
                                    <strong className="text-dark">Verified Requests:</strong>
                                    <span className="text-muted ms-1">We prevent spam by allowing only one active request per item per user.</span>
                                </div>
                            </li>
                            <li className="d-flex mb-3">
                                <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                                <div>
                                    <strong className="text-dark">Justification-Based Selection:</strong>
                                    <span className="text-muted ms-1">Donors choose recipients based on the 'Purpose' provided, ensuring items go to the most impactful causes.</span>
                                </div>
                            </li>
                            <li className="d-flex mb-3">
                                <i className="bi bi-lock-fill text-success me-3 fs-5"></i>
                                <div>
                                    <strong className="text-dark">Secure Dashboards:</strong>
                                    <span className="text-muted ms-1">Real-time updates on your activity—track how many items you've saved from waste or how many successful requests you've fulfilled.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* --- 5. Why We Stand Out (Footer Section) --- */}
                <div className="mt-5 pt-5 text-center">
                    <h3 className="fw-bold mb-5">Why We Stand Out</h3>
                    <div className="row justify-content-center g-4">
                        <div className="col-6 col-md-3">
                            <i className="bi bi-globe-americas fs-1 text-success mb-2"></i>
                            <h6 className="fw-bold">Environmental Impact</h6>
                        </div>
                        <div className="col-6 col-md-3">
                            <i className="bi bi-people-fill fs-1 text-success mb-2"></i>
                            <h6 className="fw-bold">Verified Community</h6>
                        </div>
                        <div className="col-6 col-md-3">
                            <i className="bi bi-geo-alt-fill fs-1 text-success mb-2"></i>
                            <h6 className="fw-bold">Location-Based Search</h6>
                        </div>
                        <div className="col-6 col-md-3">
                            <i className="bi bi-file-earmark-text-fill fs-1 text-success mb-2"></i>
                            <h6 className="fw-bold">Transparent Workflow</h6>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HowItWorks;