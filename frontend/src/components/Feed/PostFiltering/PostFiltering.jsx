import { useEffect, useState } from "react";
import style from "./PostFiltering.module.scss";
import { useSearchParams } from "react-router-dom";

export default function PostFiltering() {
	const [reset, setReset] = useState(false);
	const [, setSearchParams] = useSearchParams();

	const handleSort = (event, value) => {
		setSearchParams((search) => {
			if (value == "reset") {
				search.delete("filter");
				setReset((reset) => !reset);
			} else if (search.has("filter", value)) search.delete("filter", value);
			else search.append("filter", value);
			return search;
		});
	};

	return (
		<>
			<div className={style["filter-container"]}>
				<span>Filter by:</span>
				<div className={style["button-container"]}>
					<Checkbox label="followed" reset={reset} onClick={(e) => handleSort(e, "followed")} />
					<Checkbox label="friends" reset={reset} onClick={(e) => handleSort(e, "friends")} />

					<button className={style.button} onClick={(e) => handleSort(e, "reset")}>
						Reset
					</button>
				</div>
			</div>
		</>
	);
}

const Checkbox = ({ label, reset, ...props }) => {
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		setChecked(false);
	}, [reset]);

	return (
		<label className={`${style.button} ${checked ? style.active : ""}`}>
			<input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} {...props} />
			{label}
		</label>
	);
};
