import React from "react";
import { Link } from "react-router-dom";
import PostTime from "../PostTime/PostTime";
import style from "./PostHeader.module.scss";

export default function PostHeader({ post }) {
	return (
		<>
			{!post.removed && (
				<>
					<span className={style["post-user-name"]}>{post.user?.username}</span>
					<Link className={style["post-user-tag"]} to={`/user/${post.user?.userTag}`}>
						@{post.user?.userTag}
					</Link>
				</>
			)}
			<PostTime time={post.createdAt} />
		</>
	);
}
