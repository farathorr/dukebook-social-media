import style from "./ReplyForm.module.scss";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthenticationContext } from "../../AuthenticationControls/AuthenticationControls";
import { NotificationContext } from "../../NotificationControls/NotificationControls";
import { api } from "../../../api";

const postError = { type: "error", title: "Post failed" };

export default function ReplyForm(props) {
	const [authentication] = useContext(AuthenticationContext);
	const [addNotification] = useContext(NotificationContext);
	const params = useParams();
	const [replyText, setReplyText] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!authentication.isAuthenticated) return addNotification({ ...postError, message: "You must be logged in to post" });
		if (replyText.length < 1) return addNotification({ ...postError, message: "Post can't be empty" });

		try {
			const reply = { postId: params.id, postText: replyText };
			const { status } = await api.replyToPost(reply);
			if (status !== 200) return addNotification({ ...postError, message: "Failed to post reply" });
			props.updateInterface((state) => !state);
			setReplyText("");
			addNotification({ type: "success", title: "Reply successful", message: "Your reply has been posted", duration: 3000 });
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<form className={style["new-post"]} onSubmit={handleSubmit}>
			<p>New Reply</p>
			<textarea
				id="replyTextArea"
				value={replyText}
				name="replyText"
				placeholder="Write reply here"
				onInput={(e) => {
					const input = e.target;
					input.style.height = "";
					input.style.height = input.scrollHeight + "px";
				}}
				style={{ height: "52px" }}
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
	);
}
