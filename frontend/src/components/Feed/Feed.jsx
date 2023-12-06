import style from "./Feed.module.scss";
import { useState, useContext, useEffect } from "react";
import { NotificationContext } from "../NotificationControls/NotificationControls";
import PostComponent from "../PostComponent/PostComponent";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import PostSearch from "./PostSearch/PostSearch";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api";
import PostFiltering from "./PostFiltering/PostFiltering";

const postError = { type: "error", title: "Post failed" };

export default function Feed() {
	const [addNotification] = useContext(NotificationContext);
	const { authentication } = useContext(AuthenticationContext);
	const [searchParams] = useSearchParams();
	const [posts, setPosts] = useState([]);
	const [postText, setPostText] = useState("");
	const [tags, setTags] = useState("");
	const [showTagInput, setShowTagInput] = useState(false);
	const [updatePostContent, setUpdatePostContent] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!authentication.isAuthenticated) return addNotification({ ...postError, message: "You must be logged in to post" });
		if (postText.length < 1) return addNotification({ ...postError, message: "Post can't be empty" });

		try {
			const splitTags = tags.trim().length ? tags.split(" ") : [];
			const post = { userTag: authentication.user.userTag, postText, tags: splitTags };
			const { status, data } = await api.createPost(post);

			if (status === 400) return addNotification({ ...postError, message: data.message });

			setUpdatePostContent((state) => !state);
			setPostText("");
			setTags("");
			setShowTagInput(false);

			addNotification({ type: "success", title: "Post successful", message: "Your post has been posted", duration: 3000 });
		} catch (err) {}
	};

	useEffect(() => {
		async function fetchPosts() {
			try {
				const { data } = await api.getPosts(searchParams.toString());
				setPosts(data);
			} catch (err) {}
		}

		fetchPosts();
	}, [searchParams, updatePostContent, authentication]);

	return (
		<>
			<PostSearch />
			<h1 className={style["title"]}>Feed</h1>
			<section className={style["main-content"]}>
				<form className={style["new-post"]} onSubmit={handleSubmit}>
					<p>New Post</p>
					<textarea
						id="postTextArea"
						value={postText}
						name="postText"
						placeholder="Write post here"
						onChange={(e) => setPostText(e.target.value)}
						onInput={(e) => {
							const input = e.target;
							input.style.height = "";
							input.style.height = input.scrollHeight + "px";
						}}
						style={{ height: "52px" }}
					/>
					{showTagInput && (
						<input type="text" placeholder="Enter tags separated by commas" value={tags} onChange={(e) => setTags(e.target.value)} />
					)}

					<div className={style["button-container"]}>
						<button className={style["post-button"]} type="submit" value="post">
							Post
						</button>
						<button className={style["link-button"]} value="link">
							<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
								<path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
							</svg>
						</button>
						<button type="button" className={style["tags-button"]} onClick={() => setShowTagInput(!showTagInput)}>
							{showTagInput ? "Close Tags" : "Add Tags"}
						</button>
					</div>
				</form>
				<PostFiltering />
				{posts.map((post) => (
					<PostComponent
						key={post._id}
						postId={post._id}
						username={post.user?.username}
						userTag={post.user?.userTag}
						date={post.createdAt}
						text={post.postText}
						removed={post.removed}
						comments={post.comments?.length}
						dislikes={post.dislikes.length}
						likes={post.likes.length}
						onUpdate={setPosts}
						edited={post.edited}
						tags={post.tags}
					/>
				))}
			</section>
		</>
	);
}
