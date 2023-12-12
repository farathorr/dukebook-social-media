import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HeaderNav from "./components/HeaderNav/HeaderNav";
import Chat from "./pages/Chat/Chat";
import Feed from "./pages/Feed/Feed";
import Profile from "./components/Profile/Profile";
import HearedEditForm from "./components/Profile/EditHeaderInfo/HearedEditForm";
import Post from "./components/Post/Post";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NotificationContainer from "./components/NotificationContainer/NotificationContainer";
import { AuthenticationContext } from "./context/AuthenticationContext/AuthenticationContext";
import Home from "./pages/Home/Home";
import Authentication from "./pages/Authentication/Authentication";
import ImageUploader from "./components/ImageUploader/ImageUploader";
import "./App.scss";
import { useContext } from "react";
import Search from "./pages/Search/Search";

export default function App() {
	const { authentication } = useContext(AuthenticationContext);
	return (
		<BrowserRouter>
			<HeaderNav />
			<NotificationContainer />
			<ImageUploader />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/user/:userTag" element={<Profile />} />
				<Route path="/authentication" element={authentication.isAuthenticated ? <Authentication /> : <Navigate to="/login" />} />
				<Route path="/profile" element={<HearedEditForm />} />
				<Route path="/feed" element={authentication.isAuthenticated ? <Feed /> : <Navigate to="/search" />} />
				<Route path="/search" element={<Search />} />
				<Route path="/login" element={!authentication.isAuthenticated ? <Login /> : <Navigate to="/" />} />
				<Route path="/register" element={!authentication.isAuthenticated ? <Register /> : <Navigate to="/" />} />
				<Route path="/post" element={<Post />} />
				<Route path="/chat" element={authentication.isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
				<Route path="/post/:id" element={<Post />} />
			</Routes>
		</BrowserRouter>
	);
}
