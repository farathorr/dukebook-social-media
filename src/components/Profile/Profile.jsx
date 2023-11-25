import React from "react";
import style from "./Profile.module.scss";
import PostComponent from "../PostComponent/PostComponent";
import ProfileUserHeader from "./ProfileUserHeader/ProfileUserHeader";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
	const params = useParams();
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const fetchServices = async () => {
			const response = await fetch(`http://localhost:4000/users/userTag/${params.usertag}`);
			const data = await response.json();
			if (response.ok) {
				setUserData(data);
			}
		};
		fetchServices();
	}, []);

	return (
		<div className={style["profile-page"]}>
			<ProfileUserHeader
				name={userData?.username}
				userTag={userData?.userTag}
				bio={userData?.bio}
				followers={userData?.followerIds.length}
				following={userData?.followedIds.length}
				joinDate={formatDate(userData?.updatedAt)}
			/>
			<PostComponent userName={userData?.username} userTag={userData?.userTag} />
			<PostComponent userName={userData?.username} userTag={userData?.userTag} />
			<PostComponent userName={userData?.username} userTag={userData?.userTag} />
		</div>
	);
}

function formatDate(utcTime) {
	if (!utcTime) return utcTime;

	const options = { year: "numeric", month: "long", day: "numeric" };
	const time = new Date(utcTime);
	return time.toLocaleDateString("en-US", options);
}
