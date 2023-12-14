import PostTime from "../PostTime/PostTime";
import style from "./PostHeader.module.scss";
import UserTag from "../../UserTag/UserTag";
import AngleUp from "../../../svg/AngleUp";
import CustomButton from "../../CustomButton/CustomButton";
import { Link } from "react-router-dom";

export default function PostHeader({ post, hideReplies, setHideReplies }) {
	return (
		<div className={style["header-container"]}>
			<div className={style["content"]}>
				{!post.removed && (
					<>
						<span className={style["post-user-name"]}>{post.user?.username}</span>
						<UserTag tag={post.user?.userTag} isLink={true} />
					</>
				)}
				<PostTime time={post.createdAt} />
				{post.nestingLevel !== 0 &&
					(post.replyParentId._id ? (
						<Link className={style["reply-link"]} to={`/post/${post.replyParentId._id}`}>Replied to</Link>
					) : (
						<Link className={style["reply-link"]} to={`/post/${post.replyParentId}`}>Replied to</Link>
					))}
			</div>
			<CustomButton className={style["arrow"] + ` ${hideReplies ? style["active"] : ""}`} onClick={() => setHideReplies((s) => !s)}>
				<AngleUp />
			</CustomButton>
		</div>
	);
}
