import { createRef, useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../context/NotificationControls/NotificationControls";
import { AuthenticationContext } from "../../context/AuthenticationContext/AuthenticationContext";
import { api } from "../../api";
import { useParams } from "react-router-dom";

import style from "./PostForm.module.scss";
import Tags from "../TagsField/TagsField";

const postError = { type: "error", title: "Post failed" };

export default function NewPostForm({ title, updateInterface, disabled, type }) {
	const [addNotification] = useContext(NotificationContext);
	const { authentication } = useContext(AuthenticationContext);
	const params = useParams();
	const [postText, setPostText] = useState("");
	const [tags, setTags] = useState([]);
	const [showTags, setShowTags] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!authentication.isAuthenticated) return addNotification({ ...postError, message: "You must be logged in to post" });
		if (postText.length < 1) return addNotification({ ...postError, message: "Post can't be empty" });

		try {
			const formatedTags = [...new Set(tags.filter((tag) => tag.trim().replaceAll(" ", "")))];
			const postData = { postText, tags: formatedTags, postId: params?.id };
			const sendFetch = type === "post" ? api.createPost : api.replyToPost;

			const { status, data } = await sendFetch(postData);

			if (status === 400) return addNotification({ ...postError, message: data.message });

			updateInterface((state) => !state);
			setPostText("");
			setTags([]);

			addNotification({ type: "success", title: "Post successful", message: "Your post has been posted", duration: 3000 });
		} catch (err) {}
	};

	return (
		<form className={`${style["new-post"]} ${disabled ? style["disabled"] : ""}`} onSubmit={handleSubmit}>
			<p className={style["title"]}>{title}</p>
			<textarea
				id="postTextArea"
				value={postText}
				name="postText"
				placeholder="Write post here"
				disabled={disabled}
				onChange={(e) => setPostText(e.target.value)}
				onInput={(e) => {
					const input = e.target;
					input.style.height = "";
					input.style.height = input.scrollHeight + "px";
				}}
				style={{ height: "52px" }}
			/>
			{showTags && (
				<>
					<p>Tags</p>
					<Tags tags={tags} setTags={setTags} disabled={disabled} />
				</>
			)}
			<div className={style["button-container"]}>
				<button className={style["post-button"]} type="submit" disabled={disabled}>
					Post
				</button>
				<button className={style["link-button"]} type="button" disabled={disabled}>
					<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
						<path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
					</svg>
				</button>
				<button className={style["post-button"]} type="button" disabled={disabled} onClick={() => setShowTags((s) => !s)}>
					Tags
				</button>
			</div>
		</form>
	);
}
