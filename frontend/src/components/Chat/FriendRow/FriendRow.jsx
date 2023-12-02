import React from "react";
import style from "./FriendRow.module.scss";

export default function FriendList(props) {
	return (
		<div className={style["friend-row"]}>
			<img className={style["profile-pic"]} src={props.image} alt="Profile picture" width={40} height={40} />
			<div className={style["friend-info-container"]}>
				<span className={style["user-name"]}>{props.name}</span>
				<span className={style["user-last-message"]}>{props.lastMessage}</span>
			</div>
		</div>
	);
}

FriendList.defaultProps = {
	image: require("../../../images/Duke3D.png"),
	name: "Duke",
	lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
};
