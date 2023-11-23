import React from "react";
import style from "./Notification.module.scss";
import notificationsData from "./notificationsData/notificationsdata";
import { useState, useContext } from "react";
import { NotificationContext } from "../../App";

export default function Notification() {
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
}
