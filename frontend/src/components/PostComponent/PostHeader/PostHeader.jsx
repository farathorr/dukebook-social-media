import PostTime from "../PostTime/PostTime";
import style from "./PostHeader.module.scss";
import UserTag from "../../UserTag/UserTag";
import AngleUp from "../../../svg/AngleUp";
import CustomButton from "../../CustomButton/CustomButton";

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
			</div>
			<CustomButton className={style["arrow"] + ` ${hideReplies ? style["active"] : ""}`} onClick={() => setHideReplies((s) => !s)}>
				<AngleUp />
			</CustomButton>
		</div>
	);
}
