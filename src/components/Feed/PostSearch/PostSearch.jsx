import { useState } from "react";
import style from "./PostSearch.module.scss";
import { useNavigate } from "react-router";

export default function PostSearch() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");

	function handleSubmit(e) {
		e.preventDefault();
		navigate(`/feed?search=${encodeURIComponent(search.trim())}`);
	}

	return (
		<form onSubmit={handleSubmit} className={style["search-form"]}>
			<input
				className={style["search-input"]}
				name="seach"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Search"
				type="search"
				autoComplete="off"
				autoCorrect="off"
				spellCheck="false"
				autoCapitalize="off"
			/>
		</form>
	);
}
