import React from "react";

export default function Logout() {
	return (
		<div>
			<h1>Logout</h1>
			<button onClick={logout}>Logout</button>
		</div>
	);
}

function logout() {
	fetch("http://localhost:4001/auth/logout", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token: localStorage.getItem("refreshToken") }),
	});

	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
}
