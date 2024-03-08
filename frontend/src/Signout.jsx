import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import ModalComponent from './components/SignOutModal/SignOutModal';
import { NavigationContext } from "./App.jsx";
import { getCookieValue } from "./utils.js";
import { Modal } from "@mantine/core";

const Signout = () => {

    // checkUserLoggedIn();

    const navigate = useNavigate();
    const { setShowNavigation } = useContext(NavigationContext); // Access the context
    const [isModalOpen, setIsModalOpen] = useState(true); // State to control modal visibility

    const handleSignout = async () => {
        setIsModalOpen(false);
        try {
            const accessToken = getCookieValue("access_token");
            // DO YOU STILL WANT THIS INCLUDED YEHVEN?
            // document.cookie = "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            // document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            // document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            // document.cookie = "messages=; expires=Thu, 01 Jan 1970 00:00:00 GMT";

            console.log(accessToken);
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
        <Modal
				opened={isModalOpen}
				centered
                withCloseButton={false}
				size="auto"
				transitionProps={{
					transition: "slide-up",
					duration: 200,
					timingFunction: "ease-in-out",
				}}
			>
            <div className="modalContent p-5">
                <p>Are you sure you want to sign out?</p>
                <div className = "flex justify-end gap-3 mt-4">
                    <button onClick={() => setIsModalOpen(false)} className = "text-neutral-600 hover:text-neutral-800">Cancel</button>
                    <button onClick={handleSignout} className = "button-orange" >Confirm</button>
                </div>
            </div>
		</Modal>
    );
};

export default Signout;