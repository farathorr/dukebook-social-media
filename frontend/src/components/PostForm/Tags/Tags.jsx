import { createRef, useEffect } from "react";
import style from "./Tags.module.scss";

let tagIndex = -1;

export default function Tags({ tags, setTags, disabled }) {
	const tagRef = createRef();

	const onFocus = (event) => {
		if (disabled) return;
		const index = tags.findIndex((tag) => tag.length === 0);
		if (event.target.id === "tag-input") {
			if (index === -1) {
				setTags((tags) => [...tags, ""]);
				tagIndex = tags.length;
			} else tagIndex = index;

			focus();
		}
	};

	const onInput = (event, index) => {
		const newTags = [...tags];
		const value = event.target.value.replace(/[#@!"%\.?&/\\+\-']/g, "");
		const splitTags = value.split(" ");
		if (splitTags.length > 1 && value.trim()) {
			newTags[index] = splitTags[0];
			let emptyCount = 0;
			newTags.splice(index + 1, 0, ...splitTags.slice(1));
			const filteredTags = newTags.filter((tag) => tag || emptyCount++ === 0);
			tagIndex = index + splitTags.length - 1;
			setTags(filteredTags);
			return;
		} else {
			newTags[index] = value.replaceAll(" ", "");
			setTags(newTags);
		}
	};

	const focus = () => {
		if (!tagRef.current) return;
		tagRef.current.focus();
		tagIndex = -1;
	};

	const onBackspace = (event, i, tag) => {
		if (event.key === "Backspace" && tag.length === 0) {
			setTags((tags) => tags.filter((_, index) => index !== i));
			tagIndex = i - 1;
		}
	};

	useEffect(focus);

	return (
		<div className={style["tag-input"]} id="tag-input" tabIndex="0" placeholder="Enter tags" onFocus={onFocus}>
			{tags.map((tag, i) => (
				<div className={style["tag-container"]} key={i}>
					<span className={style["hashtag"]}>#</span>
					<span className={style["tag-content"]}>{tag}</span>
					<input
						key={i}
						ref={tagIndex === i ? tagRef : null}
						className={style["tag-content"]}
						autoComplete="off"
						autoCorrect="off"
						spellCheck="false"
						autoCapitalize="off"
						disabled={disabled}
						value={tag}
						onInput={(e) => onInput(e, i)}
						onKeyDown={(e) => onBackspace(e, i, tag)}
						onBlur={() => tag.length === 0 && setTags((tags) => tags.filter((tag, index) => index !== i))}
					></input>
				</div>
			))}
		</div>
	);
}
