import React from "react";
import style from "./ProfileUserHeader.module.scss";
import image from "../../../images/Duke3D.png";

export default function ProfileUserHeader(props) {
	return (
		<div className={style["profile-container"]}>
			<div className={style["right-content"]}>
				<img src={props.image} alt="" className={style["profile-pic"]} />
				<div className={style["buttons"]}>
					<button className={style["follow-button"]}>Follow</button>
					<button className={style["add-to-friend"]}>Add to friend</button>
				</div>
			</div>
			<div className={style["left-content"]}>
				<span className={style["profile-name"]}>{props.name}</span>
				<span className={style["profile-tag"]}>{props.userTag}</span>
				<pre className={style["profile-description"]}>{props.description}</pre>
				<div className={style["social-stats"]}>
					<span>Subs {props.subs}</span>
					<span>Follows {props.follows}</span>
					<span>Joined {props.joinDate}</span>
				</div>
				<div className={style["filter-buttons"]}>
					<button className={style["selected"]}>Feed</button>
					<button>Likes</button>
					<button>Something</button>
				</div>
			</div>
		</div>
	);
}

ProfileUserHeader.defaultProps = {
	name: "John Doe",
	userTag: "@johndoe",
	description: "This is a description",
	subs: 0,
	follows: 0,
	joinDate: "12 of December 2020",
	image: image,
};
