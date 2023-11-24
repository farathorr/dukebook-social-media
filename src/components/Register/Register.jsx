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

	const handleSubmit = async (event) => {
		event.preventDefault();
		const newUser = { userTag, email, password };

		try {
			const response = await fetch("http://localhost:4000/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newUser),
			});
			const data = await response.json();

			if (response.status === 400) {
				addNotification({ type: "error", message: data.message, title: "Registration", duration: 5000 });
			} else if (response.status === 409) {
				addNotification({ type: "error", message: data.message, title: "Registration", duration: 5000 });
			} else if (response.status === 201) {
				addNotification({ type: "success", message: "Registration successful", title: "Registration", duration: 5000 });
				navigate("/login");
			}
		} catch (error) {
			addNotification({ type: "info", message: "Could not establish a connect to the server", title: "Network problems", duration: 5000 });
		}

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
