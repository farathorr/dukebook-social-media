import React from "react";
import style from "./UserTag.module.scss";
import { Link } from "react-router-dom";

export default function UserTag({ tag, isLink }) {
	if (isLink) {
		return (
			<>
				<Link to={`/user/${tag}`} className={style["user-tag"]}>
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
