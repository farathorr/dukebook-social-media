import React from "react";
import style from "./Profile.module.scss";
import PostComponent from "../PostComponent/PostComponent";
import ProfileUserHeader from "./ProfileUserHeader/ProfileUserHeader";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api";

export default function Profile() {
	const params = useParams();
	const [profileData, setProfileData] = useState(null);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const { data: profileData } = await api.getUserByUserTag(params.userTag);
				const { data: posts } = await api.getPostsByAuthor(params.userTag);
				if (profileData) setProfileData(profileData);
				if (posts) setPosts(posts);
			} catch (err) {
				console.log(err);
			}
		};

		fetchServices();
	}, []);

	return (
		<div className={style["profile-page"]}>
			<ProfileUserHeader userData={profileData} />
			{posts.map((post) => (
				<PostComponent key={post._id} post={post} onUpdate={setPosts} />
			))}
		</div>
	);
}
