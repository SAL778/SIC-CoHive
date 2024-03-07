import { useNavigate } from 'react-router-dom';

export function getCookieValue(cookieName) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === cookieName) {
            return value;
        }
    }
    return null;
}

export async function checkUserLoggedIn() {
    const navigate = useNavigate();

    try {
        const accessToken = getCookieValue("access_token");
        const response = await fetch("http://localhost:8000/users/verify-login/", {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Token ${accessToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("User is authenticated:", data);
            // Add your application logic here based on the data received
        } else if (response.status === 401) {
            console.error("User not authenticated. Redirecting to login page.");
            navigate('/');  // Redirect to the login page
        } else {
            console.error("Error checking user authentication:", response.status, response.statusText);
            // Handle other authentication errors or general errors
        }
    } catch (error) {
        console.error("Error during fetch:", error);
        // Handle general fetch error
    }
}
