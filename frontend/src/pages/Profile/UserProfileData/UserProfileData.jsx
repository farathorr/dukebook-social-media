import React from "react";
import style from "./UserProfileData.module.scss";
import { formatDate } from "../../../utils/formatDate";

export default function UserProfileData({ userData, followers }) {
	return (
		<>
			<span className={style["profile-name"]}>{userData?.username}</span>
			<span className={style["profile-tag"]}>@{userData?.userTag}</span>
			<pre className={style["profile-description"]}>{userData?.bio}</pre>
			<div className={style["social-stats"]}>
				<span>
					<strong>Followers</strong> {followers}
				</span>
				<span>
					<strong>Following</strong> {userData?.followedIds.length}
				</span>
				<span>
					<strong>Joined at</strong> {formatDate(userData?.createdAt)?.longDate}
				</span>
			</div>
		</>
	);
}
