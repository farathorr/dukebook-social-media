import { useContext } from "react";
import style from "./HeaderNav.module.scss";
import { Link } from "react-router-dom";
import ProfileIcon from "./ProfileIcon/ProfileIcon";
import logo from "../../images/logo.png";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";

export default function HeaderNav() {
	const [authentication] = useContext(AuthenticationContext);
	return (
		<nav className={style["header-nav"]}>
			<img src={logo} alt="logo" />
			<div className={style.links}>
				<Link to="/">home</Link>
				{authentication.isAuthenticated && <Link to={`/user/${authentication.user.userTag}`}>profile</Link>}
				<Link to="/feed">feed</Link>
				{authentication.isAuthenticated && <Link to={`/chat`}>chat</Link>}
			</div>
			<ProfileIcon />
		</nav>
	);
}
