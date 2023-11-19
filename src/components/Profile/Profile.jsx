import React from "react";
import style from "./Profile.module.scss";
import PostComponent from "../PostComponent/PostComponent";
import ProfileUserHeader from "./ProfileUserHeader/ProfileUserHeader";

export default function Profile() {
	return (
		<div className={style["profile-page"]}>
			<ProfileUserHeader />
			<PostComponent />
			<PostComponent />
			<PostComponent />
		</div>
	);
}
