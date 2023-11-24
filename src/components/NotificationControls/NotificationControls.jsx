import { useState, createContext, useEffect } from "react";

export const NotificationContext = createContext(null);
const timePassed = (notification) => performance.now() - notification.startTime < notification.duration;

export default function NotificationControls(props) {
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			if (!localStorage.getItem("refreshToken")) return;

			const { accessToken } = await fetch("http://localhost:4001/auth/refresh", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: localStorage.getItem("refreshToken") }),
			}).then((res) => res.json());

			const testMessage = await fetch("http://localhost:4000/users/getSensitiveData", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			}).then((res) => res.json());

			addNotification({ type: "info", message: testMessage.message, title: "Sensitive data" });
		};

		fetchData();
	}, []);

	return (
		<NotificationContext.Provider value={[addNotification, notifications, setNotifications]}>{props.children}</NotificationContext.Provider>
	);

	function addNotification(notification) {
		notification = { duration: 5000, title: "title", message: "message", ...notification };
		const keys = ["type", "title", "message", "duration"]; // Debugging errors
		keys.forEach((key) => key in notification || console.error("Undefined " + key));

		notification.startTime = performance.now();
		setTimeout(() => setNotifications((notifications) => notifications.filter(timePassed)), notification.duration);
		setNotifications((notifications) => [...notifications, notification]);
	}
}
