import React from "react";
import style from "./Register.module.scss";
import { Link } from "react-router-dom";

export default function Register() {
	return (
		<div className={style["main-content"]}>
			<h1 className={style["title"]}>Register</h1>
			<form className={style["login-form"]}>
				<label htmlFor="username">Username:</label>
				<input type="text" id="username" />
				<label htmlFor="email">Email:</label>
				<input type="email" id="email" />
				<label htmlFor="password">Password:</label>
				<input type="password" id="password" />
				<input type="submit" defaultValue="register" />
			</form>
			<div className={style["register-login-container"]}>
				<label htmlFor="login">Existing user? Login here:</label>
				<Link className={style["login-button"]} to="/login">
					<button role="link">Login</button>
				</Link>
			</div>
		</div>
	);
}
