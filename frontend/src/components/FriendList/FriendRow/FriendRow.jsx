import React, { useContext } from "react";
import style from "./FriendRow.module.scss";
import UserPicture from "../../../components/UserPicture/UserPicture";
import UserTag from "../../../components/UserTag/UserTag";
import { ChatGroupContext } from "../../../context/ChatGroupContext/ChatGroupContext";
import { Link } from "react-router-dom";
import CustomButton from "../../../components/CustomButton/CustomButton";

export default function FriendList({ group }) {
	const { setGroup } = useContext(ChatGroupContext);

	return (
		<CustomButton className={style["friend-row"]} to="/chat" onClick={() => setGroup(group)}>
			<UserPicture className={style["profile-pic"]} src={group.image} size="small" />
			<div className={style["friend-info-container"]}>
				<span className={style["user-name"]}>{group.name}</span>
				{group.type === "chat" && <UserTag tag={group.name} isLink={false} />}
			</div>
		</CustomButton>
	);
}
