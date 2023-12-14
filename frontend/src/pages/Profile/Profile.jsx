import React from "react";
import style from "./Profile.module.scss";
import PostComponent from "../../components/PostComponent/PostComponent";
import ProfileUserHeader from "./ProfileUserHeader/ProfileUserHeader";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/api";
import CustomButton from "../../components/CustomButton/CustomButton";
import ScrollTopButton from "../../components/ScrollTopButton/ScrollTopButton";

export default function Profile() {
	const params = useParams();
	const [profileData, setProfileData] = useState(null);
	const [posts, setPosts] = useState([]);
	const [userNotFound, setUserNotFound] = useState(false);

	const showLikedPosts = async () => {
		try {
			const { data, status } = await api.getPosts(`liked=${profileData._id}`);
			if (status === 200) setPosts(data);
		} catch (err) {
			console.log(err);
		}
	};

	const showPosts = async () => {
		try {
			const { data, status } = await api.getPostsByAuthor(params.userTag);
			if (status === 200) setPosts(data);
		} catch (err) {
			console.log(err);
		}
	};

	const showComments = async () => {
		try {
			const { data, status } = await api.getPosts(`comments=true&author=${profileData._id}`);
			if (status === 200) setPosts(data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const fetchServices = async () => {
			setUserNotFound(false);
			try {
				const { data, status } = await api.getUserByUserTag(params.userTag);
				if (status !== 200) return setUserNotFound(true);
				setProfileData(data);
				showPosts();
			} catch (err) {
				console.log(err);
			}
		};

		fetchServices();
	}, [params.userTag]);

	const filterButtonsActions = { showLikedPosts, showPosts, showComments };

	return (
		<div className={style["profile-page"]}>
			<ProfileUserHeader userData={profileData} {...filterButtonsActions} />
			{userNotFound && <h1>User not found</h1>}
			{posts?.map((post) => (
				<PostComponent key={post._id} post={post} onUpdate={setPosts} />
			))}
			<ScrollTopButton />
		</div>
	);
}
