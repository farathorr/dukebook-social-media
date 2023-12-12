import React from "react";
import style from "./FriendRow.module.scss";

export default function FriendList({ group, setGroup }) {
	return (
		<div className={style["friend-row"]} onClick={() => setGroup(group)}>
			<img className={style["profile-pic"]} src={group.image} alt="Profile picture" width={40} height={40} />
			<div className={style["friend-info-container"]}>
				<span className={style["user-name"]}>{group.name}</span>
				<span className={style["user-last-message"]}>{group.lastMessage}</span>
			</div>
		</div>
	);
}

FriendList.defaultProps = {
	image: require("../../../images/Duke3D.png"),
	name: "Duke",
	lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
};
