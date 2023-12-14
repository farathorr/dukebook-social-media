import style from "./PostComponent.module.scss";
import PostFooter from "./PostFooter/PostFooter";
import PostHeader from "./PostHeader/PostHeader";
import PostContent from "./PostContent/PostContent";
import UserPicture from "../UserPicture/UserPicture";
import { useState } from "react";

export default function PostComponent({ post, onUpdate, ...props }) {
	const footerData = { post, onUpdate };
	const [hideReplies, setHideReplies] = useState(false);

	return (
		<div className={`${style["post-container"]} ${hideReplies ? style["hide-comments"] : ""}`}>
			<div className={style["post-data"] + " " + (!post.removed || style["removed"])}>
				<div className={style["post-content"]}>
					{!post.removed && <UserPicture src={post.user?.profilePicture} size={"small"} />}
					<div className={style["post-text-container"]}>
						<PostHeader post={post} hideReplies={hideReplies} setHideReplies={setHideReplies} />
						<PostContent post={post} {...props} className={style["content"]} />
					</div>
				</div>
				<PostFooter {...footerData} className={style["footer"]} />
			</div>
			{props.children ? (
				<div className={style["replies"]}>
					<div className={style["reply-line"]} custom-nesting={post.nestingLevel} />
					{props.children}
				</div>
			) : null}
		</div>
	);
}
