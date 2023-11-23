import React from "react";
import style from "./Register.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		const newUser = {
			username,
			email,
			password,
		};

		fetch("http://localhost:4000/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newUser),
		});

		setUsername("");
		setEmail("");
		setPassword("");
	};
	return (
		<div className={style["main-content"]}>
			<h1 className={style["title"]}>Register</h1>
			<form className={style["login-form"]} onSubmit={handleSubmit}>
				<label htmlFor="username">Username:</label>
				<input
					type="text"
					value={username}
					id="username"
					name="username"
					placeholder="Username"
					onChange={(e) => setUsername(e.target.value)}
				/>

				<label htmlFor="email">Email:</label>
				<input type="email" value={email} id="email" name="email" placeholder="your@email.com" onChange={(e) => setEmail(e.target.value)} />

				<label htmlFor="password">Password:</label>
				<input type="password" value={password} id="password" name="password" onChange={(e) => setPassword(e.target.value)} />

				<button type="submit" defaultValue="register">
					Register
				</button>
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
