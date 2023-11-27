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
	const [authentication] = useContext(AuthenticationContext);
	const [addNotification] = useContext(NotificationContext);
	const [user, setUser] = useState({});

	const fetchData = async () => {
		console.log("FETCHING DATA");
		try {
			const { data } = await axios.get(`http://localhost:4000/users/${props.userId}`);
			setFollowers(data.followerIds.length);
		} catch (err) {
			console.log(err);
		}
		try {
			// get the current user
			const currentUser = await authentication.user;
			const { data } = await axios.get(`http://localhost:4000/users/${currentUser.userid}`);
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
		} catch (err) {
			console.log(err);
		}
	};

	const handleFollow = async () => {
		// check if the user is logged in and if the user is trying to follow himself
		if (!authentication.isAuthenticated) {
			addNotification({ type: "error", message: "You must be logged in to follow users", title: "Follow failed", duration: 5000 });
			return;
		} else if (user.userTag === props.userTag) {
			addNotification({ type: "error", message: "You can't follow yourself", title: "Follow failed", duration: 5000 });
			return;
		}
		// follow/unfollow the user
		try {
			if (!isFollowing) {
				const { data } = await axios.put(`http://localhost:4000/users/follow/${props.userTag}`, { userTag: user.userTag });
				setFollowers(data.followerIds.length);
				setIsFollowing(true);
			} else if (isFollowing) {
				const { data } = await axios.put(`http://localhost:4000/users/unfollow/${props.userTag}`, { userTag: user.userTag });
				setFollowers(data.followerIds.length);
				setIsFollowing(false);
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
					<button className={style["add-to-friend"]}>Add to friend</button>
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
