import React from "react";
import style from "./UserTag.module.scss";
import { Link } from "react-router-dom";

export default function UserTag({ tag, isLink, className }) {
	const classes = [style["user-tag"]];
	if (className) classes.push(className);

	if (isLink) {
		return (
			<>
				<Link to={`/user/${tag}`} className={classes.join(" ")}>
					@{tag}
				</Link>
			</>
		);
	} else {
		return (
			<>
				<span className={style["user-tag-no-hover"]}>@{tag}</span>
			</>
		);
	}
}
