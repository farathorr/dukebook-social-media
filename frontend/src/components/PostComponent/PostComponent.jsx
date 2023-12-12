import style from "./PostComponent.module.scss";
import { Link } from "react-router-dom";
import PostTime from "./PostTime/PostTime";
import PostStats from "./PostStats/PostStats";

export default function PostComponent({ post, onUpdate, ...props }) {
	const postId = post._id;
	const username = post.user?.username;
	const userTag = post.user?.userTag;
	const date = post.createdAt;
	const text = post.postText;
	const removed = post.removed;
	const comments = post.comments?.length;
	const dislikes = post.dislikes.length;
	const likes = post.likes.length;
	const edited = post.edited;
	const tags = post.tags;
	const profilePicture = post.user?.profilePicture || "https://i.imgur.com/XY5aZDk.png";
	// const { postId, likes, dislikes, comments, userTag, text, edited, removed, tags } = post;
	const stats = { postId, likes, dislikes, comments, onUpdate, userTag, text, removed, tags };

	return (
		<div className={style["post-container"]} id={postId}>
			<div className={style["post-data"] + " " + (!removed || style["removed"])}>
				<div className={style["post-content"]}>
					{!removed && <img className={style["profile-pic"]} src={profilePicture} alt="Profile picture" width={100} height={100} />}
					<div className={style["post-text-container"]}>
						{!removed && (
							<>
								<span className={style["post-user-name"]}>{username}</span>
								<Link className={style["post-user-tag"]} to={`/user/${userTag}`}>
									@{userTag}
								</Link>
							</>
						)}
						<PostTime time={date} />
						<pre className={style["post-text"]}>{text}</pre>
						{props.images.map((image, index) => (
							<img className={style["post-image"]} src={image} key={index} alt="Picture" />
						))}
						{tags.length > 0 ? (
							<div className={style["post-tags"]}>
								{tags.map((tag, index) => (
									<Link className={style["post-tag"]} key={tag + index} to={`/search?tags=${tag}`}>
										{tag}
									</Link>
								))}
							</div>
						) : null}
						{edited ? <span className={style["edited"]}>(Edited)</span> : null}
					</div>
				</div>
				<PostStats {...stats} />
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
