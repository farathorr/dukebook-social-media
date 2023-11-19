import React from "react";
import style from "./Login.module.scss";
import { Link } from "react-router-dom";

export default function Login() {
	return (
		<div className={style["main-content"]}>
			<h1 className={style["title"]}>Login</h1>
			<form className={style["login-form"]}>
				<label htmlFor="username">Username:</label>
				<input type="text" id="username" />
				<label htmlFor="password">Password:</label>
				<input type="password" id="password" />
				<input type="submit" defaultValue="login" />
			</form>
			<div className={style["register-login-container"]}>
				<label htmlFor="register">New user? Register here:</label>
				<Link className={style["register-button"]} to="/register">
					<button role="link">Register</button>
				</Link>
			</div>
		</div>
	);
}
