import React from "react";
import style from "./UserProfileData.module.scss";
import { formatDate } from "../../../utils/formatDate";
import UserTag from "../../../components/UserTag/UserTag";

export default function UserProfileData({ userData, followers }) {
	return (
		<>
			<span className={style["profile-name"]}>{userData?.username}</span>
			<UserTag tag={userData?.userTag} />
			<pre className={style["profile-description"]}>{userData?.bio}</pre>
			<div className={style["social-stats"]}>
				<span>
					<strong>Followers</strong> {followers}
				</span>
				<span>
					<strong>Following</strong> {userData?.followedIds.length}
				</span>
				<span>
					<strong>Joined</strong> {formatDate(userData?.createdAt)?.longDate}
				</span>
			</div>
		</>
	);
}
