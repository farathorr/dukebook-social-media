import socketIO from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderNav from "./components/HeaderNav/HeaderNav";
import Chat from "./components/Chat/Chat";
import Feed from "./components/Feed/Feed";
import Profile from "./components/Profile/Profile";
import HearedEditForm from "./components/Profile/EditHeaderInfo/HearedEditForm";
import Post from "./components/Post/Post";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import NotificationControls from "./components/NotificationControls/NotificationControls";
import NotificationContainer from "./components/NotificationControls/NotificationContainer/NotificationContainer";
import AuthenticationControls from "./components/AuthenticationControls/AuthenticationControls";
import Home from "./components/Home/Home";
import "./App.scss";

const socket = socketIO.connect("http://localhost:4000");

export default function App() {
	return (
		<NotificationControls>
			<AuthenticationControls>
				<BrowserRouter>
					<HeaderNav />
					<NotificationContainer />
					<Routes>
						<Route path="/" element={<Home socket={socket} />} />
						<Route path="/user/:userTag" element={<Profile />} />
						<Route path="/user/editinfo" element={<HearedEditForm />} />
						<Route path="/feed" element={<Feed />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/post" element={<Post />} />
						<Route path="/chat" element={<Chat />} />
						<Route path="/post/:id" element={<Post />} />
					</Routes>
				</BrowserRouter>
			</AuthenticationControls>
		</NotificationControls>
	);
}
