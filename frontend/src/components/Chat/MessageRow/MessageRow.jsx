import style from "./MessageRow.module.scss";

export default function MessageRow(props) {
	return (
		<div className={style["message-row"]}>
			<img className={style["profile-pic"]} src={props.image} alt="Profile picture" width={40} height={40} />
			<div className={style["message-content"]}>
				<span className={style["message-user-name"]}>{props.name} </span>
				<span className={style["message-date"]}>{formatDate(props.date)}</span>
				{props.messages.map((message, index) => (
					<pre key={index}>{message}</pre>
				))}
			</div>
		</div>
	);
}

function formatDate(utcTime) {
	if (!utcTime) return utcTime;

	const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" };
	const time = new Date(utcTime);
	return time.toLocaleDateString("en-US", options);
}

MessageRow.defaultProps = {
	image: require("../../../images/Duke3D.png"),
	name: "Duke",
	date: "Today at 15:23",
	messages: [
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
		"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat ratione quod adipisci dolores aperiam, quidem recusandae cupiditate unde harum voluptatibus! Adipisci veritatis laborum minima modi ducimus nulla libero repudiandae! Eligendi.",
		"Lorem, ipsum dolor.",
	],
};
