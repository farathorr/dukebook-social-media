import style from "./PostFiltering.module.scss";
import { useSearchParams } from "react-router-dom";

export default function PostFiltering() {
	const [, setSearchParams] = useSearchParams();

	const handleSort = async (value) => {
		setSearchParams((search) => {
			if (value == "newest") search.delete("filter");
			else if (search.has("filter", value)) search.delete("filter", value);
			else search.append("filter", value);
			return search;
		});
	};

	return (
		<>
			<div className={style["filter-container"]}>
				<span>Sort by:</span>
				<div className={style["button-container"]}>
					<button onClick={() => handleSort("followed")}>Followed</button>
					<button onClick={() => handleSort("friends")}>Friends</button>
					<button onClick={() => handleSort("newest")}>Newest</button>
				</div>
			</div>
		</>
	);
}
