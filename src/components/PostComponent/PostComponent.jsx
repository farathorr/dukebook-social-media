import React from "react";
import style from "./PostComponent.module.scss";
import { Link } from "react-router-dom";
import PostTime from "./PostTime/PostTime";
import { useState, useContext, useEffect } from "react";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import { NotificationContext } from "../NotificationControls/NotificationControls";
import { SocketContext } from "../SocketControls/SocketControls";
import { api } from "../../api";

export default function PostComponent(props) {
	const [socket] = useContext(SocketContext);
	const [authentication] = useContext(AuthenticationContext);
	const [likes, setLikes] = useState(props.likes);
	const [dislikes, setDislikes] = useState(props.dislikes);
	const [addNotification] = useContext(NotificationContext);

	const dislike = async () => {
		if (!authentication.isAuthenticated) {
			addNotification({ type: "error", message: "You must be logged in to dislike posts", title: "Dislike failed", duration: 5000 });
			return;
		}

		const { status, data } = await api.dislikePost(props.postId);
		if (status !== 200) return addNotification({ type: "error", message: data.error, title: "Dislike failed", duration: 5000 });
		setDislikes(data.dislikes.length);
		setLikes(data.likes.length);
		socket.emit("postUpdate", { postId: props.postId, likes: data.likes.length, dislikes: data.dislikes.length });
	};

	const like = async () => {
		if (!authentication.isAuthenticated) {
			addNotification({ type: "error", message: "You must be logged in to like posts", title: "Like failed", duration: 5000 });
			return;
		}

		const { status, data } = await api.likePost(props.postId);
		if (status !== 200) return addNotification({ type: "error", message: data.error, title: "Like failed", duration: 5000 });
		setDislikes(data.dislikes.length);
		setLikes(data.likes.length);
		socket.emit("postUpdate", { postId: props.postId, likes: data.likes.length, dislikes: data.dislikes.length });
	};

	const removePost = async () => {
		const { status } = await api.removePost(props.postId);
		if (status !== 200) {
			return addNotification({ type: "error", message: "Failed to remove post", title: "Post removal failed", duration: 5000 });
		}

		addNotification({ type: "success", message: "Post removed", title: "Post removed", duration: 5000 });
		props.onRemove?.((posts) => posts.filter((post) => post._id !== props.postId));
	};

	useEffect(() => {
		socket.on("post/" + props.postId, ({ likes, dislikes }) => {
			console.log("???", likes, dislikes);
			if (dislikes != null) setDislikes(dislikes);
			if (likes != null) setLikes(likes);
		});

		return () => {
			socket.off("post/" + props.postId);
		};
	}, []);

	return (
		<div className={style["post-container"]}>
			<div className={style["post-data"]}>
				<div className={style["post-content"]}>
					<img className={style["profile-pic"]} src={props.profilePic} alt="Profile picture" width={100} height={100} />
					<div className={style["post-text-container"]}>
						<span className={style["post-user-name"]}>{props.username}</span>
						<Link className={style["post-user-tag"]} to={`/user/${props.userTag}`}>
							@{props.userTag}
						</Link>
						<PostTime time={props.date} />
						<pre className={style["post-text"]}>{props.text}</pre>
						{props.images.map((image, index) => (
							<img className={style["post-image"]} src={image} key={index} alt="Picture" />
						))}
					</div>
				</div>
				<div className={style["post-stats"]}>
					<div className={style["stat-container"]}>
						<button className={style["like-button"]} onClick={like}>
							<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
								<path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
							</svg>
							<span>{likes}</span>
						</button>
					</div>
					<div className={style["stat-container"]}>
						<button className={style["dislike-button"]} onClick={dislike}>
							<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
								<path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
							</svg>
							<span>{dislikes}</span>
						</button>
					</div>
					<div className={style["stat-container"]}>
						<Link to={"/post/" + props.postId} className={style["comment-button"]}>
							<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
								<path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
							</svg>
							<span>{props.comments}</span>
						</Link>
					</div>
					{authentication.isAuthenticated && authentication.user.userTag === props.userTag && props.onRemove ? (
						<div className={style["stat-container"] + " " + style["remove-button"]}>
							<button onClick={removePost}>Remove</button>
						</div>
					) : null}
				</div>
			</div>
			{props.children ? (
				<div className={style["replies"]}>
					<div className={style["reply-line"]} />
					{props.children}
				</div>
			) : null}
		</div>
	);
}

PostComponent.defaultProps = {
	profilePic: require("../../images/Duke3D.png"),
	username: "Duke",
	userTag: "author",
	postText:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quibusdam, voluptatum, quos, voluptatem voluptas quia quaeaspernatur voluptatibus quod doloribus quas. Quisquam quibusdam, voluptatum, quos, voluptatem voluptas quia quae aspernaturvoluptatibus quod doloribus quas.",
	images: [],
	likes: 0,
	dislikes: 0,
	comments: 0,
	date: new Date().toLocaleString(),
};
