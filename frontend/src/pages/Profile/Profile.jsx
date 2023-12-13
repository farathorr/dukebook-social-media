import React from "react";
import style from "./Profile.module.scss";
import PostComponent from "../../components/PostComponent/PostComponent";
import ProfileUserHeader from "./ProfileUserHeader/ProfileUserHeader";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/api";
import CustomButton from "../../components/CustomButton/CustomButton";

export default function Profile() {
	const params = useParams();
	const [profileData, setProfileData] = useState(null);
	const [posts, setPosts] = useState([]);
	const [positionY, setPositionY] = useState(0);
	const [isButtonVisible, setIsButtonVisible] = useState(false);
	const [userNotFound, setUserNotFound] = useState(false);

	const showLikedPosts = async () => {
		try {
			const { data, status } = await api.getPosts(`liked=${profileData._id}`);
			if (status !== 200) return;
			setPosts(data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const handleScroll = () => {
			setPositionY(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll);
		if (positionY > 600) {
			setIsButtonVisible(true);
		} else {
			setIsButtonVisible(false);
		}
	}, [window.scrollY]);

	useEffect(() => {
		const fetchServices = async () => {
			setUserNotFound(false);
			try {
				const { data, status } = await api.getUserByUserTag(params.userTag);
				if (status !== 200) return setUserNotFound(true);
				setProfileData(data);

				const posts = await api.getPostsByAuthor(params.userTag);
				if (posts.status === 200) setPosts(posts.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchServices();
	}, [params.userTag]);

	return (
		<div className={style["profile-page"]}>
			<ProfileUserHeader userData={profileData} showLikedPosts={showLikedPosts} />
			{userNotFound && <h1>User not found</h1>}
			{posts?.map((post) => (
				<PostComponent key={post._id} post={post} onUpdate={setPosts} />
			))}
			{isButtonVisible && (
				<CustomButton className={style["scroll-to-top-button"]} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
					Top
				</CustomButton>
			)}
		</div>
	);
}
