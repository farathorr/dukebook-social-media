import React from "react";
import style from "./Notification.module.scss";
import notificationsData from "./notificationsData/notificationsdata";
import { useState, useContext, createContext } from "react";
// import { NotificationContext } from "../../App";
export const NotificationContext = createContext(null);

export default function NotificationControls(props) {
	const [notifications, setNotifications] = useState([]);
	// const [addNotification, notifications, setNotifications] = useContext(NotificationContext);

	return (
		<NotificationContext.Provider value={[addNotification, notifications, setNotifications]}>{props.children}</NotificationContext.Provider>
	);

	function addNotification(notification) {
		if (notification.className === undefined) console.error("Undefined className");
		if (notification.title === undefined) console.error("Undefined title");
		if (notification.message === undefined) console.error("Undefined message");
		if (notification.duration === undefined) console.error("Undefined duration");

		notification.startTime = performance.now();
		setTimeout(updateNotifications, notification.duration);

		setNotifications([...notifications, notification]);
	}

	function updateNotifications() {
		setNotifications((currentNotification) =>
			currentNotification.filter((notification) => {
				const timeElapsed = performance.now() - notification.startTime;
				return timeElapsed < notification.duration;
			})
		);
	}
}

export const NotificationStuff = () => {
	const [addNotification, notifications, setNotifications] = useContext(NotificationContext);
	const closeButton = (notification) => {
		const newNotifications = notifications.filter((n) => n !== notification);
		setNotifications(newNotifications);
	};

	return (
		<div className={style["notifications-container"]}>
			<button
				onClick={() =>
					addNotification({
						duration: 5000,
						className: "loginError",
						title: "Failed login",
						message: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
					})
				}
			>
				Add
			</button>
			{notifications.map((notification, index) => {
				const { title, className, message } = notification;
				return (
					<div key={index} className={style[className]}>
						<div>
							<h2>{title}</h2>
							<button onClick={() => closeButton(notification)} type="button" className={style["closeButton"]}>
								X
							</button>
						</div>
						<p>{message}</p>
					</div>
				);
			})}
		</div>
	);
};
