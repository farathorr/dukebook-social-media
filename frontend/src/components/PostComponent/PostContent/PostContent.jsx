import React from "react";
import style from "./PostContent.module.scss";
import { Link } from "react-router-dom";

export default function PostContent({ post, className = "", ...props }) {
	return (
		<div className={className}>
			<pre className={style["post-text"]}>{post.postText}</pre>
			{props.images?.map((image, index) => (
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

			{post.images.length > 0 ? (
				<div className={style["post-images"]} custom-image-count={Math.min(post.images.length, 4)}>
					{post.images.map((image, index) => (
						<img className={style["post-image"]} src={image} key={index} alt="Picture" />
					))}
				</div>
			) : null}

			{post.edited ? <span className={style["edited"]}>(Edited)</span> : null}
		</div>
	);
}
