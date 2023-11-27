import { useEffect, useState } from "react";
import style from "./PostTime.module.scss";

export default function PostTime(props) {
	const [time, setTime] = useState(deltaTime(props.time));

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(deltaTime(props.time));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<span className={style.time} title={formatDate(props.time)}>
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
	if (delta < 604800) return Math.floor(delta / 86400) + "days";
	if (delta < 2628000) return Math.floor(delta / 604800) + "weeks";
	if (delta < 31536000) return Math.floor(delta / 2628000) + "Months";
	if (delta >= 31536000) return Math.floor(delta / 31536000) + "years";
}

function formatDate(utcTime) {
	if (!utcTime) return utcTime;

	const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
	const time = new Date(utcTime);
	return time.toLocaleDateString("en-US", options);
}
