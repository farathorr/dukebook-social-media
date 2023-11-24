import React from "react";
import style from "./Login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { NotificationContext } from "../NotificationControls/NotificationControls";

export default function Login() {
	const [addNotification] = useContext(NotificationContext);
	const navigate = useNavigate();
	const [userTag, setUsertag] = useState("");
	const [password, setPassword] = useState("");
	const [rememberPassword, setRememberPassword] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const user = { userTag, password };

		try {
			const response = await fetch("http://localhost:4001/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(user),
			});

			if (response.status === 400) {
				addNotification({ type: "error", message: "Wrong password", title: "Login failed", duration: 5000 });
			} else if (response.status === 404) {
				addNotification({ type: "error", message: "User not found", title: "Login failed", duration: 5000 });
			} else if (response.status === 200) {
				const data = await response.json();
				if (rememberPassword) {
					localStorage.setItem("accessToken", data.accessToken);
					localStorage.setItem("refreshToken", data.refreshToken);
				}
				addNotification({ type: "success", message: "Login successful", title: "Login successful", duration: 2000 });
				navigate("/profile");

				// Test endpoint
				const testMessage = await fetch("http://localhost:4000/users/getSensitiveData", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${data.accessToken}`,
					},
				}).then((res) => res.json());

				addNotification({ type: "info", message: testMessage.message, title: "Sensitive data" });
			}
		} catch (error) {
			addNotification({ type: "info", message: "Could not establish a connect to the server", title: "Network problems", duration: 5000 });
		}

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
				<input
					type="checkbox"
					id="remember-me"
					name="remember-me"
					checked={rememberPassword}
					onChange={(e) => setRememberPassword(e.target.checked)}
				/>
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
