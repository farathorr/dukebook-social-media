import React from "react";
import style from "./ProfileUserHeader.module.scss";
import image from "../../../images/Duke3D.png";
import { useState, useEffect, useContext } from "react";
import { AuthenticationContext } from "../../AuthenticationControls/AuthenticationControls";
import { NotificationContext } from "../../NotificationControls/NotificationControls";
import { api } from "../../../api";

export default function ProfileUserHeader(props) {
	const [isFollowing, setIsFollowing] = useState(false);
	const [followers, setFollowers] = useState(0);
	const [followButtonText, setFollowButtonText] = useState("Follow");
	const [isFriend, setIsFriend] = useState(false);
	const [friendButtonText, setFriendButtonText] = useState("Add as friend");
	const [authentication] = useContext(AuthenticationContext);
	const [addNotification] = useContext(NotificationContext);
	const [user, setUser] = useState({});

	const fetchData = async () => {
		if (!props.userId) return;
		try {
			const { data } = await api.getUserById(props.userId);
			setFollowers(data.followerIds.length);
		} catch (err) {
			console.log(err);
		}
		try {
			const currentUser = authentication.user;
			if (!currentUser) return;
			const { data } = await api.getUserById(currentUser.userId);
			setUser(data);
			const isAlreadyFollowed = data.followedIds?.some((id) => id === props.userId);
			setIsFollowing(isAlreadyFollowed);
			// update the follow button text
			if (isAlreadyFollowed) setFollowButtonText("Unfollow");
			else setFollowButtonText("Follow");

			const isAlreadyFriend = data.friendList?.some((id) => id === props.userId);
			setIsFriend(isAlreadyFriend);

			if (isAlreadyFriend) setFriendButtonText("Remove friend");
			else setFriendButtonText("Add as friend");
		} catch (err) {
			console.log(err);
		}
	};

	const checkAuthentication = (operationType) => {
		if (authentication.isAuthenticated) {
			return true;
		} else {
			addNotification({
				type: "error",
				message: "You must be logged in to " + operationType.toLowerCase() + " users",
				title: operationType + " failed",
				duration: 5000,
			});
			return false;
		}
	};

	const checkIfOwnProfile = (operationType) => {
		if (user.userTag === props.userTag) {
			addNotification({
				type: "error",
				message: "You can't " + operationType.toLowerCase() + " yourself",
				title: operationType + " failed",
				duration: 5000,
			});
			return true;
		}
		return false;
	};

	const handleFollow = async () => {
		// check if the user is logged in and if the user is trying to follow himself
		if (!checkAuthentication("Follow") || checkIfOwnProfile("Follow")) return;

		console.log(user);
		// follow/unfollow the user
		try {
			const action = isFollowing ? api.unfollowUser : api.followUser;
			const { data } = await action(props.userTag);
			console.log(data);
			setFollowers(data.followerIds.length);
			setIsFollowing(!isFollowing);
		} catch (err) {
			console.log(err);
		}
	};

	const handleFriend = async () => {
		if (!checkAuthentication("Friend") || checkIfOwnProfile("Friend")) return;

		try {
			const action = isFriend ? api.removeFriend : api.addFriend;
			await action(props.userTag);
			setFriendButtonText(`${!isFriend ? "Remove" : "Add as"} friend`);
			setIsFriend(!isFriend);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchData();
	}, [authentication.user, props.followers.length, isFollowing]);

	return (
		<div className={style["profile-container"]}>
			<div className={style["right-content"]}>
				<img src={props.image} alt="" className={style["profile-pic"]} />
				<div className={style["buttons"]}>
					<button className={style["follow-button"]} onClick={handleFollow}>
						{followButtonText}
					</button>
					<button className={style["add-to-friend"]} onClick={handleFriend}>
						{friendButtonText}
					</button>
				</div>
			</div>
			<div className={style["left-content"]}>
				<span className={style["profile-name"]}>{props.username}</span>
				<span className={style["profile-tag"]}>@{props.userTag}</span>
				<pre className={style["profile-description"]}>{props.bio}</pre>
				<div className={style["social-stats"]}>
					<span>
						<strong>Followers</strong> {followers}
					</span>
					<span>
						<strong>Following</strong> {props.following}
					</span>
					<span>
						<strong>Joined at</strong> {props.joinDate}
					</span>
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
	username: "User name",
	userTag: "userTag",
	bio: "This is a profile bio text",
	followers: -1,
	following: -1,
	joinDate: "December 12, 2020",
	image: image,
};
