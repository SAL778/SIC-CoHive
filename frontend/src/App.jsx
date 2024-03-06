import React, { useState, createContext} from "react";
import "./App.css";
import "./output.css";
import Navigation from "./components/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bookings from "./Bookings.jsx";
import Events from "./Events.jsx";
import Statistics from "./Statistics.jsx";
import Profile from "./Profile/Profile.jsx";
import Signout from "./Signout.jsx";
import Community from "./Community.jsx";
import Feedback from "./Feedback.jsx";
import Modal from 'react-modal';
import { MantineProvider } from '@mantine/core';

export const HostContext = createContext();
export const UserContext = createContext();

function App() {
	Modal.setAppElement('#root');
	const [host] = useState('http://localhost:8000'); //Replace host here
	const [user, setUser] = useState(null)			  //User gets added to context on login

	return (
		<HostContext.Provider value = {{ host }}>
			<UserContext.Provider value = {{user, setUser}}>
				<MantineProvider>
					<Router>
						<div className="flex h-screen w-screen flex-col md:flex-row md:overflow-hidden body-white py-0 px-[30px] gap-[40px]">
							<Navigation />
							<Routes>
								<Route path="/bookings" element={<Bookings />} />
								<Route path="/events" element={<Events />} />
								<Route path="/community" element={<Community />} />
								<Route path="/statistics" element={<Statistics />} />
								<Route path="/profile" element={<Profile />} />
								<Route path="/feedback" element={<Feedback />} />
								<Route path="/signout" element={<Signout />} />
							</Routes>
						</div>
					</Router>
				</MantineProvider>
			</UserContext.Provider>
		</HostContext.Provider>
	);
}

export default App;
