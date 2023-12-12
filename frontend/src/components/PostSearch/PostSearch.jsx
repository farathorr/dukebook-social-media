import { createRef, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import style from "./PostSearch.module.scss";

let focus = false;
export default function PostSearch() {
	const navigate = useNavigate();
	const searchRef = createRef(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchValue, setSearchValue] = useState(initialValue());

	function initialValue() {
		const search = searchParams.get("search") || "";
		const tags = searchParams.getAll("tags");
		const string = search + (tags.length > 0 ? " #" + tags.join("# ") : "");
		return string.trim();
	}

	function handleSubmit(event) {
		event.preventDefault();
		setSearchParams((search) => {
			const values = searchValue.split(/(#\w+)/g);
			search.delete("search");
			search.delete("tags");
			let sValue = "";
			values.forEach((value, index) => {
				if (value.startsWith("#")) search.append("tags", value.slice(1));
				else if (value.trim().length > 0) sValue += value.trim() + " ";
			});

			sValue = sValue.trim();
			if (sValue) search.set("search", sValue);
			return search;
		});

		navigate("/search?" + searchParams.toString());
	}

	const onSearchChange = (event) => {
		const value = event.target.value;
		setSearchValue(value);

		if (value.trim().length === 0) {
			setSearchParams((search) => {
				search.delete("tags");
				search.delete("search");
				return search;
			});
		}
	};

	useEffect(() => {
		if (!focus) setSearchValue(initialValue());
	});

	useEffect(() => {
		if (window.location.pathname === "/search") searchRef.current?.focus();
	}, [searchRef.current]);

	return (
		<form onSubmit={handleSubmit} className={style["search-form"]}>
			<input
				className={style["search-input"]}
				name="seach"
				value={searchValue}
				onChange={onSearchChange}
				placeholder="Search"
				type="search"
				autoComplete="off"
				autoCorrect="off"
				spellCheck="false"
				autoCapitalize="off"
				ref={searchRef}
				onBlur={() => (focus = false)}
				onFocus={() => (focus = true)}
			/>
		</form>
	);
}
