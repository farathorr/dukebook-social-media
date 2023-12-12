import React from "react";
import PostTime from "../PostTime/PostTime";
import style from "./PostHeader.module.scss";
import UserTag from "../../UserTag/UserTag";

export default function PostHeader({ post }) {
	return (
		<>
			{!post.removed && (
				<>
					<span className={style["post-user-name"]}>{post.user?.username}</span>
					<UserTag tag={post.user?.userTag} link={true} />
				</>
			)}
			<PostTime time={post.createdAt} />
		</>
	);
}
