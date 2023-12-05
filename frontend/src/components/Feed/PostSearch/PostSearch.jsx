import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import style from "./PostSearch.module.scss";

export default function PostSearch() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

	function handleSubmit(event) {
		event.preventDefault();
		setSearchParams((search) => {
			search.set("search", searchValue.trim());
			return search;
		});
	}

	const onSearchChange = (event) => {
		const value = event.target.value;
		setSearchValue(value);

		if (value.trim().length === 0) {
			setSearchParams((search) => {
				search.delete("search");
				return search;
			});
		}
	};

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
			/>
		</form>
	);
}
