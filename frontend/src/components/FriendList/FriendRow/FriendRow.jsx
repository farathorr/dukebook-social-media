import React, { useContext } from "react";
import style from "./FriendRow.module.scss";
import UserPicture from "../../../components/UserPicture/UserPicture";
import UserTag from "../../../components/UserTag/UserTag";
import { ChatGroupContext } from "../../../context/ChatGroupContext/ChatGroupContext";
import { Link } from "react-router-dom";

export default function FriendList({ group }) {
	const { setGroup } = useContext(ChatGroupContext);

	if (group.type === "group") {
		return (
			<Link className={style["friend-row"]} to="/chat" onClick={() => setGroup(group)}>
				<UserPicture src={group.image} size="small" />
				<div className={style["friend-info-container"]}>
					<span className={style["user-name"]}>{group.name}</span>
					<span className={style["user-last-message"]}>{group.lastMessage}</span>
				</div>
			</Link>
		);
	} else {
		return (
			<Link className={style["friend-row"]} to="/chat" onClick={() => setGroup(group)}>
				<UserPicture src={group.image} size="small" />
				<div className={style["friend-info-container"]}>
					<span className={style["user-name"]}>{group.name}</span>
					<UserTag tag={group.name} isLink={true} />
					<span className={style["user-last-message"]}>{group.lastMessage}</span>
				</div>
			</Link>
		);
	}
}
