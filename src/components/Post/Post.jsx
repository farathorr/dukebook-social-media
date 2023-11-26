import React from "react";
import style from "./Post.module.scss";
import PostComponent from "../PostComponent/PostComponent";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import { NotificationContext } from "../NotificationControls/NotificationControls";

export default function Post() {
	const [authentication] = useContext(AuthenticationContext);
	const [addNotification] = useContext(NotificationContext);
	const params = useParams();
	const [postData, setPostData] = useState([]);
	const [repliesData, setReplies] = useState([]);
	const [replyText, setReplyText] = useState("");
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("POOOST", postData);

		if (!authentication.isAuthenticated) {
			addNotification({ type: "error", message: "You must be logged in to post", title: "Post failed", duration: 5000 });
			return;
		}

		if (replyText.length < 1) {
			addNotification({ type: "error", message: "Post can't be empty", title: "Post failed", duration: 5000 });
			return;
		}

		let reply = { userTag: authentication.user.userTag, postText: replyText, userId: authentication.user._id };

		const response = await fetch(`http://localhost:4000/posts/${params.id}/reply`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reply),
		});
	};

	useEffect(() => {
		const fetchServices = async () => {
			const parentPost = await fetch(`http://localhost:4000/posts/${params.id}`);
			const postData = await parentPost.json();
			if (parentPost.ok) {
				setPostData(postData);
			}
			const replies = await fetch(`http://localhost:4000/posts/${params.id}/replies`);
			const repliesData = await replies.json();
			if (replies.ok) {
				setReplies(repliesData);
			}
			console.log(repliesData);
		};
		fetchServices();
	}, [params]);

	return (
		<>
			<h1 className={style["title"]}>Post</h1>
			<main className={style["main-content"]}>
				<PostComponent
					key={postData._id}
					postId={postData._id}
					userTag={"@" + postData.user?.userTag}
					userName={postData.user?.userName}
					text={postData.postText}
				></PostComponent>
				<form className={style["new-post"]} onSubmit={handleSubmit}>
					<p>New Reply</p>
					<textarea
						id="replyTextArea"
						value={replyText}
						name="replyText"
						placeholder="Write reply here"
						onChange={(e) => setReplyText(e.target.value)}
					/>
					<div className={style["button-container"]}>
						<button className={style["post-button"]} type="submit" value="post">
							Post
						</button>
						<button className={style["link-button"]} value="link">
							<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
								<path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
							</svg>
						</button>
					</div>
				</form>
				<div className={style["main-replies"]}></div>
				{repliesData.map((reply) => (
					<PostComponent
						key={reply._id}
						postId={reply._id}
						userTag={"@" + reply.user?.userTag}
						username={reply.user?.username}
						text={reply.postText}
					></PostComponent>
				))}
			</main>
		</>
	);
}
