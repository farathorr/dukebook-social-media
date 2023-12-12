import style from "./PostComponent.module.scss";
import PostFooter from "./PostFooter/PostFooter";
import PostHeader from "./PostHeader/PostHeader";
import PostContent from "./PostContent/PostContent";

export default function PostComponent({ post, onUpdate, profilePic, ...props }) {
	const postId = post._id;
	const userTag = post.user?.userTag;
	const text = post.postText;
	const removed = post.removed;
	const comments = post.comments?.length;
	const dislikes = post.dislikes.length;
	const likes = post.likes.length;
	const tags = post.tags;
	// const { postId, likes, dislikes, comments, userTag, text, edited, removed, tags } = post;
	const stats = { postId, likes, dislikes, comments, onUpdate, userTag, text, removed, tags };

	return (
		<div className={style["post-container"]} id={postId}>
			<div className={style["post-data"] + " " + (!removed || style["removed"])}>
				<div className={style["post-content"]}>
					{!removed && <img className={style["profile-pic"]} src={profilePic} alt="Profile picture" width={100} height={100} />}
					<div className={style["post-text-container"]}>
						<PostHeader post={post} />
						<PostContent post={post} {...props} />
					</div>
				</div>
				<PostFooter {...stats} />
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
