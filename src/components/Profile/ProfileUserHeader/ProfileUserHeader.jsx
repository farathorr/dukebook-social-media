import React from "react";
import style from "./ProfileUserHeader.module.scss";
import image from "../../../images/Duke3D.png";
import { useState, useEffect, useContext } from "react";
import { AuthenticationContext } from "../../AuthenticationControls/AuthenticationControls";
import { NotificationContext } from "../../NotificationControls/NotificationControls";
import axios from "axios";

export default function ProfileUserHeader(props) {
	const [isFollowing, setIsFollowing] = useState(false);
	const [followers, setFollowers] = useState();
	const [followButtonText, setFollowButtonText] = useState("Follow");
	const [isFriend, setIsFriend] = useState(false);
	const [friendButtonText, setFriendButtonText] = useState("Add as friend");
	const [authentication] = useContext(AuthenticationContext);
	const [addNotification] = useContext(NotificationContext);
	const [user, setUser] = useState({});

	const fetchData = async () => {
		console.log("FETCHING DATA");
		try {
			const { data } = await axios.get(`http://localhost:4000/users/${props.userId}`, { withCredentials: true });
			setFollowers(data.followerIds.length);
		} catch (err) {
			console.log(err);
		}
		try {
			// FOLLOWS
			// get the current user
			const currentUser = await authentication.user;
			const { data } = await axios.get(`http://localhost:4000/users/${currentUser.userId}`, { withCredentials: true });
			setUser(data);
			// check if the user is already following the profile user
			const isAlreadyFollowed = data.followedIds?.some((id) => id === props.userId);
			setIsFollowing(isAlreadyFollowed);
			// update the follow button text
			if (isAlreadyFollowed) {
				setFollowButtonText("Unfollow");
			} else {
				setFollowButtonText("Follow");
			}
			// FRIENDS
			// check if the user is already friends with the profile user
			const isAlreadyFriend = data.friendList?.some((id) => id === props.userId);
			setIsFriend(isAlreadyFriend);
			console.log("isAlreadyFriend", isAlreadyFriend);
			// update the friend button text
			if (isAlreadyFriend) {
				setFriendButtonText("Remove friend");
			} else {
				setFriendButtonText("Add as friend");
			}
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
			if (!isFollowing) {
				const { data } = await axios.put(
					`http://localhost:4000/users/follow/${props.userTag}`,
					{ userTag: user.userTag },
					{ withCredentials: true }
				);
				setFollowers(data.followerIds.length);
				setIsFollowing(true);
			} else if (isFollowing) {
				const { data } = await axios.put(
					`http://localhost:4000/users/unfollow/${props.userTag}`,
					{ userTag: user.userTag },
					{ withCredentials: true }
				);
				setFollowers(data.followerIds.length);
				setIsFollowing(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleFriend = async () => {
		if (!checkAuthentication("Friend") || checkIfOwnProfile("Friend")) return;

		try {
			if (!isFriend) {
				await axios.put(`http://localhost:4000/users/addFriend/${props.userTag}`, { userTag: user.userTag }, { withCredentials: true });
				setIsFriend(true);
				setFriendButtonText("Remove friend");
			} else if (isFriend) {
				await axios.put(`http://localhost:4000/users/removeFriend/${props.userTag}`, { userTag: user.userTag }, { withCredentials: true });
				setIsFriend(false);
				setFriendButtonText("Add as friend");
			}
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
