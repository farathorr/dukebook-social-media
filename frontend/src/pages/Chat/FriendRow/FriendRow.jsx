import React from "react";
import style from "./FriendRow.module.scss";
import UserPicture from "../../../components/UserPicture/UserPicture";

export default function FriendList({ group, setGroup }) {
	return (
		<div className={style["friend-row"]} onClick={() => setGroup(group)}>
			<UserPicture src={group.image} size="small" />
			<div className={style["friend-info-container"]}>
				<span className={style["user-name"]}>{group.name}</span>
				<span className={style["user-last-message"]}>{group.lastMessage}</span>
			</div>
		</div>
	);
}
