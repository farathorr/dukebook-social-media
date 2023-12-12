import style from "./PostFooter.module.scss";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../../context/AuthenticationContext/AuthenticationContext";
import { NotificationContext } from "../../../context/NotificationControls/NotificationControls";
import { api } from "../../../utils/api";
import TagsField from "../../TagsField/TagsField";
import CustomButton from "../../CustomButton/CustomButton";
import ArrowUp from "../../../svg/ArrowUp";
import ArrowDown from "../../../svg/ArrowDown";
import SpeechBubble from "../../../svg/SpeechBubble";

export default function PostFooter({ postId, likes, dislikes, comments, userTag, onUpdate, text, removed, tags }) {
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
		<>
			<div className={style["post-stats"]}>
				<CustomButton className={style["like-button"]} onClick={like}>
					<ArrowUp />
					<span>{stats.likes}</span>
				</CustomButton>

				<CustomButton className={style["dislike-button"]} onClick={dislike}>
					<ArrowDown />
					<span>{stats.dislikes}</span>
				</CustomButton>

				<CustomButton className={style["comment-button"]} to={"/post/" + postId + "#reply"}>
					<SpeechBubble />
					<span>{stats.comments}</span>
				</CustomButton>

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
			{editable ? (
				<div className="edit-container">
					<form onSubmit={handleEdit} className={style["edit-form"]}>
						<textarea className={style["edit-area"]} name="edit-area" id="edit-area" cols="30" rows="10" defaultValue={text}></textarea>
						<TagsField tags={tagsArray} setTags={setTagsArray} disabled={false} />
						<button className={style["save-button"]} type="submit">
							Save
						</button>
					</form>
				</div>
			) : null}
		</>
	);
}
