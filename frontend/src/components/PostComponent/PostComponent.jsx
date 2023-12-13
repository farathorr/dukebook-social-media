import style from "./PostComponent.module.scss";
import PostFooter from "./PostFooter/PostFooter";
import PostHeader from "./PostHeader/PostHeader";
import PostContent from "./PostContent/PostContent";
import UserPicture from "../UserPicture/UserPicture";

export default function PostComponent({ post, onUpdate, ...props }) {
	const footerData = { post, onUpdate };

	return (
		<div className={style["post-container"]}>
			<div className={style["post-data"] + " " + (!post.removed || style["removed"])}>
				<div className={style["post-content"]}>
					{!post.removed && <UserPicture src={post.user?.profilePicture} size={"small"} />}
					<div className={style["post-text-container"]}>
						<PostHeader post={post} />
						<PostContent post={post} {...props} />
					</div>
				</div>
				<PostFooter {...footerData} />
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
