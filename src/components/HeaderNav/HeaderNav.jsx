import React from "react";
import style from "./HeaderNav.module.scss";
import { Link } from "react-router-dom";
import ProfileIcon from "./ProfileIcon/ProfileIcon";
import logo from "../../images/logo.png";

export default function HeaderNav() {
	return (
		<nav className={style["header-nav"]}>
			<img src={logo} alt="logo" />
			<div className={style.links}>
				<Link to="/">home</Link>
				<Link to="/user/nash">profile</Link>
				<Link to="/feed">feed</Link>
				<Link to="/post">post</Link>
				<Link to="/chat">chat</Link>
			</div>
			<ProfileIcon />
		</nav>
	);
}
