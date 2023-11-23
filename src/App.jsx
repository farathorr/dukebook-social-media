import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, createContext } from "react";
import HeaderNav from "./components/HeaderNav/HeaderNav";
import Chat from "./components/Chat/Chat";
import Feed from "./components/Feed/Feed";
import Profile from "./components/Profile/Profile";
import Post from "./components/Post/Post";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Notification from "./components/Notification/Notifications";

import "./App.scss";
export const NotificationContext = createContext(null);

function App() {
	const [notifications, setNotifications] = useState([]);

	return (
		<NotificationContext.Provider value={[addNotification, notifications, setNotifications]}>
			<BrowserRouter>
				<HeaderNav />
				<Notification />
				<Routes>
					<Route path="/" element={<div>Home</div>} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/feed" element={<Feed />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/post" element={<Post />} />
					<Route path="/chat" element={<Chat />} />
				</Routes>
			</BrowserRouter>
		</NotificationContext.Provider>
	);

	function addNotification(notification) {
		if (notification.className === undefined) console.error("Undefined className");
		if (notification.title === undefined) console.error("Undefined title");
		if (notification.message === undefined) console.error("Undefined message");
		if (notification.duration === undefined) console.error("Undefined duration");

		notification.startTime = performance.now();
		setTimeout(updateNotifications, notification.duration);

		setNotifications([...notifications, notification]);
	}
	function updateNotifications() {
		setNotifications((currentNotification) =>
			currentNotification.filter((notification) => {
				const timeElapsed = performance.now() - notification.startTime;
				return timeElapsed < notification.duration;
			})
		);
	}
}

export default App;
