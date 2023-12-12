import style from "./PostStats.module.scss";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../AuthenticationControls/AuthenticationControls";
import { NotificationContext } from "../../../context/NotificationControls/NotificationControls";
import { api } from "../../../api";
import TagsField from "../../TagsField/TagsField";

export default function PostStats({ postId, likes, dislikes, comments, userTag, onUpdate, text, removed, tags }) {
	const { authentication } = useContext(AuthenticationContext);
	const [addNotification] = useContext(NotificationContext);
	const [editable, setEditable] = useState(false);
	const stats = api.usePostStats(postId, { likes, dislikes, comments });
	const [tagsArray, setTagsArray] = useState(tags);

	const optionConstructor = (option, apiFetch) => async () => {
		if (removed)
			return addNotification({ type: "error", message: `You can't ${option.toLowerCase()} a removed post`, title: `${option} failed` });
		if (!authentication.isAuthenticated)
			return addNotification({
				type: "error",
				message: `You must be logged in to ${option.toLowerCase()} posts`,
				title: `${option} failed`,
			});

		try {
			const { status, data } = await apiFetch(postId);
			if (status !== 200) return addNotification({ type: "error", message: data.error, title: `${option} failed` });
			stats.setDislikes(data.dislikes.length);
			stats.setLikes(data.likes.length);
		} catch (err) {
			console.log(err);
		}
	};

	const dislike = optionConstructor("Dislike", api.dislikePost);
	const like = optionConstructor("Like", api.likePost);

	const removePost = async () => {
		const { status } = await api.removePost(postId);
		if (status !== 200) return addNotification({ type: "error", message: "Failed to remove post", title: "Post removal failed" });

		addNotification({ type: "success", message: "Post removed", title: "Post removed" });
		onUpdate?.((posts) => posts.filter((post) => post._id !== postId));
	};

	const editPost = async () => {
		setEditable(!editable);
	};

	const handleEdit = async (event) => {
		event.preventDefault();
		const post = {
			postId,
			postText: event.target["edit-area"].value,
			tags: tagsArray,
		};
		const { status } = await api.updatePost(post);
		if (status !== 200) return addNotification({ type: "error", message: "Failed to edit post", title: "Post edit failed" });

		addNotification({ type: "success", message: "Post edited", title: "Post edited" });
		setEditable(false);
		onUpdate?.((posts) => posts.map((p) => (p._id === postId ? { ...p, ...post } : p)));
	};

	return (
		<div>
			<div className={style["post-stats"]}>
				<div className={style["stat-container"]}>
					<button className={style["like-button"]} onClick={like}>
						<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
							<path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
						</svg>
						<span>{stats.likes}</span>
					</button>
				</div>
				<div className={style["stat-container"]}>
					<button className={style["dislike-button"]} onClick={dislike}>
						<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
							<path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
						</svg>
						<span>{stats.dislikes}</span>
					</button>
				</div>
				<div className={style["stat-container"]}>
					<Link to={"/post/" + postId + "#reply"} className={style["comment-button"]}>
						<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
							<path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
						</svg>
						<span>{stats.comments}</span>
					</Link>
				</div>
				{authentication.isAuthenticated && authentication.user.userTag === userTag && onUpdate ? (
					<div className={style["stat-container"] + " " + style["remove-button"]}>
						<button onClick={removePost}>Remove</button>
					</div>
				) : null}
				{authentication.isAuthenticated && authentication.user.userTag === userTag && onUpdate ? (
					<div className={style["stat-container"] + " " + style["edit-button"]}>
						<button onClick={editPost}>Edit</button>
					</div>
				) : null}
			</div>
			<div className="edit-container">
				{editable ? (
					<form onSubmit={handleEdit} className={style["edit-form"]}>
						<textarea className={style["edit-area"]} name="edit-area" id="edit-area" cols="30" rows="10" defaultValue={text}></textarea>
						<TagsField tags={tagsArray} setTags={setTagsArray} disabled={false} />
						<button className={style["save-button"]} type="submit">
							Save
						</button>
					</form>
				) : null}
			</div>
		</div>
	);
}
