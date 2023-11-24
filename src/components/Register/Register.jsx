import React from "react";
import style from "./Register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { NotificationContext } from "../NotificationControls/NotificationControls";

export default function Register() {
	const [addNotification] = useContext(NotificationContext);
	const navigate = useNavigate();
	const [userTag, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
		const numRegex = /[0-9]/;
		if (password !== confirmPassword) {
			console.error("Passwords don't match");
			return;
		}
		if (password.length < 8) {
			console.error("Password must be at least 8 characters long");
			return;
		}
		if (!regex.test(password)) {
			console.error("Password contains no special characters");
			return;
		}
		if (!numRegex.test(password)) {
			console.error("Password must contain at least one number");
			return;
		}

		const newUser = {
			userTag,
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
				<label htmlFor="userTag">Username:</label>
				<input
					type="text"
					value={userTag}
					id="userTag"
					name="userTag"
					placeholder="Username"
					onChange={(e) => setUsername(e.target.value)}
				/>

				<label htmlFor="email">Email:</label>
				<input type="email" value={email} id="email" name="email" placeholder="your@email.com" onChange={(e) => setEmail(e.target.value)} />

				<label htmlFor="password">Password:</label>
				<input
					type="password"
					value={password}
					id="password"
					name="password"
					placeholder="Password"
					onChange={(e) => setPassword(e.target.value)}
				/>

				<label htmlFor="confirm-password">Confirm password:</label>
				<input
					type="password"
					id="confirm-password"
					value={confirmPassword}
					name="confirm-password"
					placeholder="Confirm password"
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>

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
