import { useEffect, useState } from "react";
import style from "./PostTime.module.scss";
import { formatDate } from "../../../utils/formatDate";

export default function PostTime(props) {
	const [time, setTime] = useState(deltaTime(props.time));

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(deltaTime(props.time));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<span className={style.time} title={formatDate(props.time).longFullDate}>
			{time}
		</span>
	);
}

function deltaTime(time) {
	const timeA = new Date(time);
	const timeB = new Date();

	const delta = Math.ceil(Math.abs(timeA - timeB) / 1000);
	if (delta < 60) return delta + "s";
	if (delta < 3600) return Math.floor(delta / 60) + "m";
	if (delta < 86400) return Math.floor(delta / 3600) + "h";
	if (delta < 604800) return Math.floor(delta / 86400) + "d";
	if (delta < 2628000) return Math.floor(delta / 604800) + "w";
	if (delta < 31536000) return Math.floor(delta / 2628000) + "M";
	if (delta >= 31536000) return Math.floor(delta / 31536000) + "y";
}
