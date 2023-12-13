import { Navigate, Outlet } from "react-router-dom";
import { AuthenticationContext } from "../../context/AuthenticationContext/AuthenticationContext";
import { useContext } from "react";
import HeaderNav from "../../components/HeaderNav/HeaderNav";
import FriendList from "../../components/FriendList/FriendList";
import style from "./Layout.module.scss";

const Layout = () => {
	const { authentication } = useContext(AuthenticationContext);

	return (
		<div className={style["page-content"]}>
			<HeaderNav />
			{authentication.isAuthenticated ? <Outlet /> : <Navigate to="/login" />}
			<FriendList />
		</div>
	);
};

export default Layout;
