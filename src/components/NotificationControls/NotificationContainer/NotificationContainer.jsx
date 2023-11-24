import { useContext } from "react";
import { NotificationContext } from "../NotificationControls";
import Notification from "../Notification/Notification";
import style from "./NotificationContainer.module.scss";

export default function NotificationContainer() {
	const [addNotification, notifications, setNotifications] = useContext(NotificationContext);
	const closeButton = (notification) => setNotifications((notifications) => notifications.filter((n) => n !== notification));

	return (
		<div className={style["notifications-container"]}>
			<button
				onClick={() => {
					addNotification({
						duration: 5000,
						type: "error",
						title: "Error",
						message: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
					});
					addNotification({
						duration: 5000,
						type: "warning",
						title: "Warning",
						message: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
					});
					addNotification({
						duration: 5000,
						type: "info",
						title: "Info",
						message: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
					});
					addNotification({
						duration: 5000,
						type: "success",
						title: "Success",
						message: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
					});
				}}
			>
				Add
			</button>
			{notifications.map((notification, index) => (
				<Notification notification={notification} onClose={closeButton} key={index} />
			))}
		</div>
	);
}
