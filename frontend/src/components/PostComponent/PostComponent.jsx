import style from "./PostComponent.module.scss";
import PostFooter from "./PostFooter/PostFooter";
import PostHeader from "./PostHeader/PostHeader";
import PostContent from "./PostContent/PostContent";
import UserPicture from "../UserPicture/UserPicture";

export default function PostComponent({ post, onUpdate, ...props }) {
	const postId = post._id;
	const userTag = post.user?.userTag;
	const text = post.postText;
	const removed = post.removed;
	const comments = post.comments?.length;
	const dislikes = post.dislikes.length;
	const likes = post.likes.length;
	const tags = post.tags;
	const profilePicture = post.user?.profilePicture;
	const stats = { postId, likes, dislikes, comments, onUpdate, userTag, text, removed, tags };

	return (
		<div className={style["post-container"]}>
			<div className={style["post-data"] + " " + (!removed || style["removed"])}>
				<div className={style["post-content"]}>
					{!removed && <UserPicture src={profilePicture} size={"small"} />}
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
