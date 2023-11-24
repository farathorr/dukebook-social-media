import React from "react";
import style from "./Login.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
	const [userTag, setUsertag] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			console.error("Passwords don't match");
			return;
		}
		const user = {
			userTag,
			password,
		};

		fetch("http://localhost:4000/users/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});

		setUsertag("");
		setPassword("");
	};

	return (
		<div className={style["main-content"]}>
			<h1 className={style["title"]}>Login</h1>
			<form className={style["login-form"]} onSubmit={handleSubmit}>
				<label htmlFor="usertag">Usertag:</label>
				<input type="text" id="usertag" value={userTag} name="usertag" placeholder="Usertag" onChange={(e) => setUsertag(e.target.value)} />
				<label htmlFor="password">Password:</label>
				<input
					type="password"
					id="password"
					value={password}
					name="password"
					placeholder="Password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				<label htmlFor="remember-me">Remember me:</label>
				<input type="checkbox" id="remember-me" name="remember-me" />
				<button type="submit" defaultValue="login">
					Login
				</button>
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
