import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationContext } from "./App.jsx";
import "./404.css";

function FOF() {
    const navigate = useNavigate();
    const { showNavigation, setShowNavigation } = useContext(NavigationContext);
    const handleBackClick = () => {
        navigate('/feedback');
    };

    useEffect(() => {
        setShowNavigation(false);
    }, [showNavigation]);

    const handleGoBack = () => {
        navigate('/bookings');
    };

    return (
        <div className="background">
            <div className="container">
                <div className="left-col">
                    <h1>404</h1>
                </div>
                <div className="right-col">
                    <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                    <div className="right-col-buttons">
                        <button className="contact-button orange-button" style={{marginTop: '20px', justifyContent: 'flex-start', alignItems: 'center'}} onClick={handleBackClick}>
                            Contact Us
                        </button>
                        <button className="contact-button orange-button" onClick={handleGoBack}>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
  );
}
export default FOF;