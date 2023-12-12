import React from "react";
import style from "./UserPicture.module.scss";

export default function UserPicture({ src, size }) {
	if (size === "big") {
		return (
			<>
				<img src={src || "https://i.imgur.com/XY5aZDk.png"} alt="ProfilePicture" className={style["profile-big-pic"]} />
			</>
		);
	} else if (size === "small") {
		return (
			<>
				<img src={src || "https://i.imgur.com/XY5aZDk.png"} alt="ProfilePicture" className={style["profile-small-pic"]} />
			</>
		);
	}
}
