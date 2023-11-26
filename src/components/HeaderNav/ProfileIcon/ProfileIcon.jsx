import style from "./ProfileIcon.module.scss";
import { AuthenticationContext } from "../../AuthenticationControls/AuthenticationControls";
import { useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileIcon() {
	const [authentication, setAuthentication] = useContext(AuthenticationContext);
	const navigate = useNavigate();
	if (!authentication.isAuthenticated)
		return (
			<Link to="/login" className={style["sign-in"]}>
				Sign in
			</Link>
		);

	return (
		<div className={style["profile-icon"]} onClick={logout}>
			<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
				<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
			</svg>
		</div>
	);

	function logout() {
		const token = authentication.refreshToken;
		if (token) axios.post("http://localhost:4001/auth/logout", { token }).catch((err) => {});

		authentication.isAuthenticated = false;
		authentication.accessToken = null;
		authentication.refreshToken = null;
		setAuthentication({ ...authentication });

		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		navigate("/");
	}
}
