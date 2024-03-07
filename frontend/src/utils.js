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


/**
 * Makes an HTTP request.
 * @param {Object} httpRequestOptions - The options for the HTTP request.
 * @param {string} httpRequestOptions.endpoint - The endpoint to retrieve from.
 * @param {string} [httpRequestOptions.method="GET"] - HTTP method, "GET", "POST", etc. Defaults to "GET".
 * @param {boolean} [httpRequestOptions.useAuth=true] - Whether or not to use auth. Invokes getCookieValue. Defaults to true.
 * @param {function} httpRequestOptions.onSuccess - Callback on what to do with response (as JSON).
 * @param {function} [httpRequestOptions.onFailure=res => console.log(res.statusText)] - Callback triggered on failure. Defaults to console.log.
 * @param {function} [httpRequestOptions.onError=e => console.log("error", e)] - Callback triggered on error. Defaults to console.log.
 */

//This destructures the Object, so they can be used directly.
export async function httpRequest({
    endpoint,
    useAuth = true, 
    method = "GET", 
    onSuccess, 
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
            options.headers = {Authorization: `Token ${token}`}
        }
        
        const res = await fetch(endpoint, options)

        if (res.ok) {
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