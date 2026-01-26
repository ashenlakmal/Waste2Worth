import React from 'react';

const Footer = () => {
    return (
        <footer className="text-white pt-5 pb-4" style={{ backgroundColor: '#1B4332' }}>
            <div className="container">
                <div className="row d-flex justify-content-between align-items-center">
                    { }
                    <div className="col-md-8 text-center text-md-start">
                        <h4 className="fw-bold mb-2">Waste2Worth(W2W)</h4>
                        <p className="small mb-0 opacity-75">
                            Encouraging sustainability and promoting a culture of reuse instead of disposal.
                        </p>
                    </div>

                    { }
                    <div className="col-md-4 text-center text-md-end mt-4 mt-md-0">
                        <div className="d-flex justify-content-center justify-content-md-end gap-4 mb-3">
                            <a href="#" className="text-white text-decoration-none small">Home</a>
                            <a href="#" className="text-white text-decoration-none small">About Us</a>
                            <a href="#" className="text-white text-decoration-none small">Privacy Policy</a>
                        </div>
                        <div className="d-flex justify-content-center justify-content-md-end gap-3 fs-4">
                            <a href="#" className="text-white"><i className="fab fa-facebook"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>

                { }
                <hr className="my-4 border-light opacity-25" />

                { }
                <div className="text-center small opacity-75">
                    <i className="far fa-copyright me-2"></i> 2025 Waste2Worth. All right Reserved
                </div>
            </div>
        </footer>
    );
};

export default Footer;