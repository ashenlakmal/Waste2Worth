import React from 'react';

const Footer = () => {
    return (
        <footer className="py-5 text-white" style={{ backgroundColor: '#1B4332' }}>
            <div className="container">
                <div className="row align-items-center">
                    {/* වම් පැත්ත - විස්තර */}
                    <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
                        <h5 className="fw-bold mb-2">Waste2Worth (W2W)</h5>
                        <p className="small opacity-75 mb-0">
                            Encouraging sustainability and promoting a culture of reuse instead of disposal.
                        </p>
                    </div>

                    {/* දකුණු පැත්ත - Links සහ Social Media */}
                    <div className="col-md-6 text-center text-md-end">
                        <div className="d-flex justify-content-center justify-content-md-end gap-4 mb-3">
                            <a href="#" className="text-white text-decoration-none small footer-link">Home</a>
                            <a href="#" className="text-white text-decoration-none small footer-link">About Us</a>
                            <a href="#" className="text-white text-decoration-none small footer-link">Privacy Policy</a>
                        </div>
                        <div className="d-flex justify-content-center justify-content-md-end gap-3 fs-5">
                            <a href="#" className="text-white"><i className="fab fa-facebook"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>

                <hr className="my-4 border-light opacity-25" />

                <div className="text-center small opacity-50">
                    © 2024 Waste2Worth. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

// මේ පේළිය අනිවාර්යයෙන්ම තියෙන්න ඕන, නැත්නම් App.js එකේදී Error එක එනවා
export default Footer;