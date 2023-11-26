import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderNav from "./components/HeaderNav/HeaderNav";
import Chat from "./components/Chat/Chat";
import Feed from "./components/Feed/Feed";
import Profile from "./components/Profile/Profile";
import Post from "./components/Post/Post";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import NotificationControls from "./components/NotificationControls/NotificationControls";
import NotificationContainer from "./components/NotificationControls/NotificationContainer/NotificationContainer";
import AuthenticationControls from "./components/AuthenticationControls/AuthenticationControls";

import "./App.scss";

export default function App() {
	return (
		<NotificationControls>
			<AuthenticationControls>
				<BrowserRouter>
					<HeaderNav />
					<NotificationContainer />
					<Routes>
						<Route path="/" element={<div>Home</div>} />
						<Route path="/user/:usertag" element={<Profile />} />
						<Route path="/feed" element={<Feed />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/post" element={<Post />} />
						<Route path="/chat" element={<Chat />} />
					</Routes>
				</BrowserRouter>
			</AuthenticationControls>
		</NotificationControls>
	);
}
