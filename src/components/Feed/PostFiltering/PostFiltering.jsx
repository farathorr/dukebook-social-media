import style from "./PostFiltering.module.scss";
import { useNavigate } from "react-router-dom";

export default function PostFiltering() {
	const navigate = useNavigate();
	const handleSort = async (filter) => {
		navigate(`/feed?filter=${filter}`);
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
