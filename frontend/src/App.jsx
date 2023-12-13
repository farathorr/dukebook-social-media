import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HeaderNav from "./components/HeaderNav/HeaderNav";
import Chat from "./pages/Chat/Chat";
import Feed from "./pages/Feed/Feed";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Post from "./pages/Post/Post";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NotificationContainer from "./components/NotificationContainer/NotificationContainer";
import { AuthenticationContext } from "./context/AuthenticationContext/AuthenticationContext";
import Home from "./pages/Home/Home";
import Authentication from "./pages/Authentication/Authentication";
import "./App.scss";
import { useContext } from "react";
import Search from "./pages/Search/Search";
import Layout from "./pages/Layout/Layout";

export default function App() {
	const { authentication } = useContext(AuthenticationContext);
	return (
		<BrowserRouter>
			<NotificationContainer />
			<Routes>
				<Route path="/login" element={!authentication.isAuthenticated ? <Login /> : <Navigate to="/" />} />
				<Route path="/register" element={!authentication.isAuthenticated ? <Register /> : <Navigate to="/" />} />

				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="/user/:userTag" element={<Profile />} />
					<Route path="/authentication" element={<Authentication />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/feed" element={<Feed />} />
					<Route path="/search" element={<Search />} />
					<Route path="/post" element={<Post />} />
					<Route path="/chat" element={<Chat />} />
					<Route path="/post/:id" element={<Post />} />
					<Route path="*" element={<h1>404 Page not found</h1>} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
