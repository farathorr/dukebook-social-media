import React from "react";
import style from "./Register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { NotificationContext } from "../NotificationControls/NotificationControls";
import { set } from "mongoose";

export default function Register() {
	const [addNotification] = useContext(NotificationContext);
	const navigate = useNavigate();
	const [userTag, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
		const numRegex = /[0-9]/;
		if (password !== confirmPassword) {
			addNotification({ type: "error", message: "Passwords don't match", title: "Registration failed", duration: 5000 });
			return;
		}
		if (password.length < 8) {
			addNotification({ type: "error", message: "Password must be 8 characters long", title: "Registration failed", duration: 5000 });
			return;
		}
		if (!regex.test(password)) {
			addNotification({
				type: "error",
				message: "Password needs to contain at least 1 special character",
				title: "Registration failed",
				duration: 5000,
			});
			return;
		}
		if (!numRegex.test(password)) {
			addNotification({
				type: "error",
				message: "Password needs to contain at least 1 number",
				title: "Registration failed",
				duration: 5000,
			});
			return;
		}

		let user = {
			userTag,
			email,
			password,
		};

		const response = await fetch("http://localhost:4000/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});

		const data = await response.json();

		if (response.status === 409) {
			addNotification({ type: "error", message: "User already exists", title: "Registration failed", duration: 5000 });
		} else if (response.status === 201) {
			addNotification({ type: "success", message: "Registration successful", title: "Registration successful", duration: 5000 });
			navigate("/feed");
		}

		setUsername("");
		setEmail("");
		setPassword("");
		setConfirmPassword("");
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
