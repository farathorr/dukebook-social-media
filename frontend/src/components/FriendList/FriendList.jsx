import { useContext, useEffect, useState } from "react";
import style from "./FriendList.module.scss";
import { api } from "../../utils/api";
import { AuthenticationContext } from "../../context/AuthenticationContext/AuthenticationContext";
import { NotificationContext } from "../../context/NotificationControls/NotificationControls";
import FriendRow from "./FriendRow/FriendRow";

export default function FriendList() {
	const [addNotification] = useContext(NotificationContext);
	const { authentication } = useContext(AuthenticationContext);
	const [messageGroups, setMessageGroups] = useState([]);
	const [group, setGroup] = useState(JSON.parse(sessionStorage.getItem("lastGroup")) || null);

	useEffect(() => {
		if (!authentication.isAuthenticated) return;
		const fetchServices = async () => {
			const { status, data } = await api.getMessageGroups();
			if (status !== 200) return addNotification({ type: "error", title: "Error", message: "Failed to fetch message groups" });
			setMessageGroups(data);
		};

		fetchServices();
	}, [authentication]);

	return (
		<div className={style["friend-list"]}>
			{messageGroups.map((group) => (
				<FriendRow key={group._id} setGroup={setGroup} group={group} />
			))}
		</div>
	);
}
