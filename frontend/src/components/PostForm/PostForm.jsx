import { useContext, useState } from "react";
import { NotificationContext } from "../../context/NotificationControls/NotificationControls";
import { AuthenticationContext } from "../../context/AuthenticationContext/AuthenticationContext";
import { api } from "../../utils/api";
import { useParams } from "react-router-dom";
import CustomButton from "../CustomButton/CustomButton";

import style from "./PostForm.module.scss";
import Tags from "../TagsField/TagsField";
import LinkIcon from "../../svg/linkIcon";
import { ImageUploaderContext } from "../ImageUploader/ImageUploader";
import ImageForm from "../ImageForm/ImageForm";

const postError = { type: "error", title: "Post failed" };

export default function PostForm({ title, updateInterface, disabled, type }) {
	const { imageUploader } = useContext(ImageUploaderContext);
	const [addNotification] = useContext(NotificationContext);
	const { authentication } = useContext(AuthenticationContext);
	const params = useParams();
	const [postText, setPostText] = useState("");
	const [tags, setTags] = useState([]);
	const [showTags, setShowTags] = useState(false);
	const [images, setImages] = useState([]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!authentication.isAuthenticated) return addNotification({ ...postError, message: "You must be logged in to post" });
		if (postText.length < 1) return addNotification({ ...postError, message: "Post can't be empty" });
		if (postText.length > 400) return addNotification({ ...postError, message: "Post can't be longer than 400 characters" });

		try {
			const formatedTags = [...new Set(tags.filter((tag) => tag.trim().replaceAll(" ", "")))];
			const postData = { postText, tags: formatedTags, postId: params?.id, images };
			const sendFetch = type === "post" ? api.createPost : api.replyToPost;

			const { status, data } = await sendFetch(postData);

			if (status === 400) return addNotification({ ...postError, message: data.message });

			updateInterface((state) => !state);
			setPostText("");
			setTags([]);
			setImages([]);

			addNotification({ type: "success", title: "Post successful", message: "Your post has been posted", duration: 3000 });
		} catch (err) {}
	};

	const handleImageUpload = async () => {
		imageUploader((url) => setImages((state) => [...state, url]));
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
			<div className={style["footer"]}>
				<ImageForm images={images} setImages={setImages} />
				<div className={style["button-container"]}>
					<CustomButton purpose="dark" type="submit" disabled={disabled}>
						Post
					</CustomButton>
					<CustomButton purpose="dark" type="button" disabled={disabled} onClick={handleImageUpload}>
						<LinkIcon />
					</CustomButton>
					<CustomButton purpose="dark" type="button" disabled={disabled} onClick={() => setShowTags((s) => !s)}>
						Tags
					</CustomButton>
				</div>
			</div>
		</form>
	);
}
