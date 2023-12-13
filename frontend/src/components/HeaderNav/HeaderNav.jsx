import { useContext } from "react";
import style from "./HeaderNav.module.scss";
import { AuthenticationContext } from "../../context/AuthenticationContext/AuthenticationContext";
import NavButton from "./NavButton/NavButton";
import HomeIcon from "../../svg/HomeIcon";
import UserPicture from "../UserPicture/UserPicture";
import UserIcon from "../../svg/UserIcon";
import SearchIcon from "../../svg/SearchIcon";
import ChatIcon from "../../svg/ChatIcon";
import PostIcon from "../../svg/PostIcon";
import LikeIcon from "../../svg/LikeIcon";
import LogoutIcon from "../../svg/LogoutIcon";

export default function HeaderNav() {
	const { authentication } = useContext(AuthenticationContext);

	return (
		<nav className={style["header-nav"]}>
			{authentication.isAuthenticated ? (
				<NavButton to={`user/${authentication.user?.userTag}`}>
					<UserPicture src={authentication.user?.profilePicture} />
				</NavButton>
			) : (
				<NavButton to={"/login"}>
					<UserIcon />
				</NavButton>
			)}
			{authentication.isAuthenticated && (
				<>
					<NavButton to="/">
						<HomeIcon />
					</NavButton>
					<NavButton to="/search">
						<SearchIcon />
					</NavButton>
					<NavButton to={`/user/${authentication.user.userTag}`}>
						<LikeIcon />
					</NavButton>
					<NavButton to="/chat">
						<ChatIcon />
					</NavButton>
					<NavButton to={"/login"}>
						<LogoutIcon />
					</NavButton>
				</>
			)}
		</nav>
	);
}
