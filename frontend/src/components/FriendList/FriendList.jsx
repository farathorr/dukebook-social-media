import { useContext, useEffect, useState } from "react";
import style from "./FriendList.module.scss";
import { api } from "../../utils/api";
import { AuthenticationContext } from "../../context/AuthenticationContext/AuthenticationContext";
import { NotificationContext } from "../../context/NotificationControls/NotificationControls";
import FriendRow from "./FriendRow/FriendRow";
import CustomButton from "../CustomButton/CustomButton";

export default function FriendList() {
	const [addNotification] = useContext(NotificationContext);
	const { authentication } = useContext(AuthenticationContext);
	const [type, setType] = useState("chat");
	const [messageGroups, setMessageGroups] = useState([]);

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
			<div className={style["buttons"]}>
				<CustomButton purpose="action" onClick={(e) => setType("chat")}>
					Friends
				</CustomButton>
				<CustomButton purpose="action" onClick={(e) => setType("group")}>
					Groups
				</CustomButton>
			</div>
			{messageGroups
				.filter((g) => g.type === type)
				.map((group) => (
					<FriendRow key={group._id} group={group} />
				))}
		</div>
	);
}
