import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import ModalComponent from './components/SignOutModal/SignOutModal';
import { NavigationContext } from "./App.jsx";
import { getCookieValue, checkUserLoggedIn } from "./utils.js"

const Signout = () => {

    checkUserLoggedIn();

    const navigate = useNavigate();
    const { setShowNavigation } = useContext(NavigationContext); // Access the context
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    const handleSignout = async () => {
        setIsModalOpen(false);
        try {
            // document.cookie = "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            // document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            // document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            // document.cookie = "messages=; expires=Thu, 01 Jan 1970 00:00:00 GMT";

            const accessToken = getCookieValue("access_token");
            const response = await fetch('http://localhost:8000/users/signout/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                  Authorization: `Token ${accessToken}`,
                },
            });
            if (response.ok) {
                setShowNavigation(false);
                navigate('/');
            } else {
                console.error('Failed to sign out');
            }
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    };

    return (
        <>
            <button onClick={() => setIsModalOpen(true)}>Sign Out</button>
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSignout}
            />
        </>
    );
};

export default Signout;