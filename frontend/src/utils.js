import { useNavigate } from "react-router-dom";

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
	onFailure = (res) => {
		console.log(res);
		if (res.status === 401) {
			if (window.location.pathname !== "/") {
				window.location.href = "/";
			}
		}
	},
	onError = (e) => console.log("error", e),
}) {
	try {
		const token = getCookieValue("access_token");
		const options = {
			method: method,
		};
		if (useAuth) {
			options.credentials = "include";
			options.headers = { Authorization: `Token ${token}`, ...options.headers };
		}
		if (body) {
			options.headers = {
				"Content-Type": "application/json",
				...options.headers,
			};
			options.body = body;
		}

		const res = await fetch(endpoint, options);

		if (res.status == 204) {
			//No data to operate on.
			onSuccess();
		} else if (res.ok) {
			try {
				res.json().then((data) => {
					onSuccess(data);
				});
			} catch (e) {
				console.log(e);
			}
		} else {
			onFailure(res);
		}
	} catch (e) {
		onError(e);
	}
}

/**
 *
 * @param {Object} queryParams
 */
export function toQueryString(queryParams) {
	const queryString = Object.entries(queryParams)
		.filter(
			([key, value]) => value !== null && value !== undefined && value !== ""
		) // Filtering out null, undefined, and empty string values
		.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
		.join("&");

	return queryString;
}

export const toProperImageURL = (sharedImageLink) => {
	if (
		sharedImageLink &&
		sharedImageLink.includes("/d/") &&
		sharedImageLink.includes("/view")
	) {
		return `https://drive.google.com/thumbnail?id=${
			sharedImageLink.split("/d/")[1].split("/view")[0]
		}`;
	} else {
		return null;
	}
};

/**
 * PRNG Color Generator based on a string
 */
export function genHexColor(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = "#";
	for (let i = 0; i < 3; i++) {
		let value = (hash >> (i * 8)) & 0xff;
		// Adjust the value to avoid colors too close to 0 or 255
		value = Math.max(30, Math.min(value, 225));
		color += value.toString(16).padStart(2, "0"); // Ensure each component is two characters
	}

	return color;
}
