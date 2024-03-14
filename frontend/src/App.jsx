import React, { useState, createContext, useEffect } from "react";
import "./App.css";
import "./output.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import '@mantine/tiptap/styles.css';
import '@mantine/carousel/styles.css';
import Navigation from "./components/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bookings from "./Bookings.jsx";
import Events from "./Events.jsx";
import Statistics from "./Statistics.jsx";
import EditProfile from "./Profile/EditProfile.jsx";
import Signout from "./Signout.jsx";
import Community from "./Community.jsx";
import Feedback from "./Feedback.jsx";
import Login from "./Login.jsx";
import Modal from "react-modal";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const HostContext = createContext();
export const UserContext = createContext();
export const NavigationContext = createContext();

const sicTheme = createTheme({
	primaryColor: "orange",
	colors: {
		primary: ["#EA580C"],
	},
});

function App() {
	Modal.setAppElement("#root");
	const [host] = useState("http://localhost:8000"); //Replace host here
	const [currentUser, setCurrentUser] = useState(null); //User gets added to context on login
	const [showNavigation, setShowNavigation] = useState(true);

	return (
		<GoogleOAuthProvider clientId="738911792381-du1hc1l4go32tj2iunbnufo6qf9h0u7v.apps.googleusercontent.com">
			<HostContext.Provider value={{ host }}>
				<UserContext.Provider value={{ currentUser, setCurrentUser }}>
					<NavigationContext.Provider
						value={{ showNavigation, setShowNavigation }}
					>
						<MantineProvider theme={sicTheme}>
							<Notifications />
							<Router>
								<div
									className={`flex min-h-screen h-full w-[100%] flex-col md:flex-row body-white py-0 ${
										showNavigation ? "pl-[350px]" : "pl-[30px]"
									} pr-[30px] gap-[40px]`}
								>
									{showNavigation && <Navigation />}
									<Routes>
										<Route path="/" element={<Login />} />
										<Route path="/bookings" element={<Bookings />} />
										<Route path="/events" element={<Events />} />
										<Route path="/community" element={<Community />} />
										<Route path="/statistics" element={<Statistics />} />
										<Route path="/profile" element={<EditProfile />} />
										<Route path="/feedback" element={<Feedback />} />
										<Route path="/signout" element={<Signout />} />
									</Routes>
								</div>
							</Router>
						</MantineProvider>
					</NavigationContext.Provider>
				</UserContext.Provider>
			</HostContext.Provider>
		</GoogleOAuthProvider>
	);
}

export default App;
