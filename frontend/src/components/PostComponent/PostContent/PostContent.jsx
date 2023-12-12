import React from "react";
import style from "./PostContent.module.scss";
import { Link } from "react-router-dom";

export default function PostContent({ post, ...props }) {
	return (
		<>
			<pre className={style["post-text"]}>{post.postText}</pre>
			{props.images.map((image, index) => (
				<img className={style["post-image"]} src={image} key={index} alt="Picture" />
			))}
			{post.tags.length > 0 ? (
				<div className={style["post-tags"]}>
					{post.tags.map((tag, index) => (
						<Link className={style["post-tag"]} key={tag + index} to={`/search?tags=${tag}`}>
							{tag}
						</Link>
					))}
				</div>
			) : null}
			{post.edited ? <span className={style["edited"]}>(Edited)</span> : null}
		</>
	);
}
