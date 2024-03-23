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

// export async function checkUserLoggedIn() {
//     const navigate = useNavigate();

//     try {
//         const accessToken = getCookieValue("access_token");
//         const response = await fetch("http://localhost:8000/users/verify-login/", {
//             method: "GET",
//             credentials: "include",
//             headers: {
//                 Authorization: `Token ${accessToken}`,
//             },
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log("User is authenticated:", data);
//             // Add your application logic here based on the data received
//         } else if (response.status === 401) {
//             console.error("User not authenticated. Redirecting to login page.");
//             navigate('/');  // Redirect to the login page
//         } else {
//             console.error("Error checking user authentication:", response.status, response.statusText);
//             // Handle other authentication errors or general errors
//         }
//     } catch (error) {
//         console.error("Error during fetch:", error);
//         // Handle general fetch error
//     }
// }

/**
 * Makes an HTTP request.
 * @param {Object} httpRequestOptions - The options for the HTTP request.
 * @param {string} httpRequestOptions.endpoint - The endpoint to retrieve from.
 * @param {string} [httpRequestOptions.method="GET"] - HTTP method, "GET", "POST", etc. Defaults to "GET".
 * @param {boolean} [httpRequestOptions.useAuth=true] - Whether or not to use auth. Invokes getCookieValue. Defaults to true.
 * @param {any} [httpRequestOptions.body=null] - The content of the request as JSON.stringify
 * @param {function} httpRequestOptions.onSuccess - Callback on what to do with response (as JSON).
 * @param {function} [httpRequestOptions.onFailure=res => console.log(res.statusText)] - Callback triggered on failure. Defaults to console.log.
 * @param {function} [httpRequestOptions.onError=e => console.log("error", e)] - Callback triggered on error. Defaults to console.log.
 */
export async function httpRequest({
    //This destructures the Object, so they can be used directly.
    endpoint,
    useAuth = true, 
    method = "GET", 
    onSuccess, 
    body = null,
    onFailure = ((res) => console.log(res.statusText)), 
    onError = ((e) => console.log("error", e))
    }) {
    try {
        const token = getCookieValue("access_token")
        const options = {
            method: method
        }
        if (useAuth) {
            options.credentials = "include"
            options.headers = {Authorization: `Token ${token}`, ...options.headers}
        }
        if (body) {
            options.headers = {"Content-Type": "application/json", ...options.headers}
            options.body = body;
        }
        
        const res = await fetch(endpoint, options)
        
        if (res.status === 204) {
            onSuccess() //No data
        }
        else if (res.ok) {
            res.json().then(data => {
                onSuccess(data)
            });
        }
        else {
            onFailure(res)
        }
    }
    catch (e) {
        onError(e)
    } 
}