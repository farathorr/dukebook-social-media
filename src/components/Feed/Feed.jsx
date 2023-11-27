import style from "./Feed.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { NotificationContext } from "../NotificationControls/NotificationControls";
import PostComponent from "../PostComponent/PostComponent";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import PostSearch from "./PostSearch/PostSearch";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function Feed() {
	const [addNotification] = useContext(NotificationContext);
	const [authentication] = useContext(AuthenticationContext);
	const [searchParams] = useSearchParams();
	const [posts, setPosts] = useState([]);
	const [postText, setPostText] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (postText.length < 1) {
			addNotification({ type: "error", message: "Post can't be empty", title: "Post failed", duration: 5000 });
			return;
		}
		if (!authentication.isAuthenticated) {
			addNotification({ type: "error", message: "You must be logged in to post", title: "Post failed", duration: 5000 });
			return;
		}
		console.log(authentication);
		let post = { userTag: authentication.user.userTag, postText };

		const response = await fetch("http://localhost:4000/posts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(post),
		});
		navigate("/post/" + (await response.json())._id);
	};

	useEffect(() => {
		async function fetchPosts() {
			const url = searchParams.get("search")?.length ? `/search/${searchParams.get("search")}` : "";
			try {
				const { data } = await axios.get("http://localhost:4000/posts" + url);
				console.log(data);
				setPosts(data);
			} catch (error) {}
		}

		fetchPosts();
	}, [searchParams]);

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
				{posts.map((post) => {
					return (
						<PostComponent
							key={post._id}
							postId={post._id}
							username={post.user.username}
							userTag={post.user.userTag}
							date={post.date}
							text={post.postText}
							likes={post.likes.length}
							dislikes={post.dislikes.length}
						/>
					);
				})}
			</section>
		</>
	);
}
