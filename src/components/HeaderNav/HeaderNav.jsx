import React from "react";
import style from "./HeaderNav.module.scss";
import { Link } from "react-router-dom";

export default function HeaderNav() {
	return (
		<nav className={style["header-nav"]}>
			<img src="" alt="logo" />
			<Link to="/">home</Link>
			<Link to="/user/nash">profile</Link>
			<Link to="/feed">feed</Link>
			<Link to="/login">login</Link>
			<Link to="/Logout">logout</Link>
			<Link to="/register">register</Link>
			<Link to="/post">post</Link>
			<Link to="/chat">chat</Link>
		</nav>
	);
}
