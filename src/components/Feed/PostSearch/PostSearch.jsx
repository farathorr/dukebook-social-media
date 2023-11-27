import { useState } from "react";
import style from "./PostSearch.module.scss";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

export default function PostSearch() {
	const [searchParams] = useSearchParams();
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const navigate = useNavigate();

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
