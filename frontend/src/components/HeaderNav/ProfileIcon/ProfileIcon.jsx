import style from "./ProfileIcon.module.scss";
import { AuthenticationContext } from "../../../context/AuthenticationContext/AuthenticationContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../utils/api";
import UserPicture from "../../UserPicture/UserPicture";

export default function ProfileIcon() {
	const { authentication, dispatchAuthentication } = useContext(AuthenticationContext);
	const profilePic = authentication.user?.profilePicture;
	const navigate = useNavigate();
	if (!authentication.isAuthenticated)
		return (
			<Link to="/login" className={style["sign-in"]}>
				Sign in
			</Link>
		);

	return (
		<div className={style["profile-icon"]} onClick={logout}>
			<UserPicture src={profilePic} size="small" />
		</div>
	);

	function logout() {
		api.logout();
		dispatchAuthentication({ type: "logout" });
		navigate("/");
	}
}
