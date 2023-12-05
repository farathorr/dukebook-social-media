import { useEffect, useState } from "react";
import style from "./MessageRow.module.scss";

export default function MessageRow(props) {
	return (
		<div className={style["message-row"]}>
			<img className={style["profile-pic"]} src={props.image} alt="Profile picture" width={40} height={40} />
			<div className={style["message-content"]}>
				<span className={style["message-user-name"]}>{props.name} </span>
				<span className={style["message-date"]}>{formatDate(props.date)}</span>

				{props.messages.map((message, index) => (
					<MessageText key={index} text={message.text} tooltip={message.date} />
				))}
			</div>
		</div>
	);
}

function MessageText({ text, tooltip }) {
	const linkRegex = /(https?:\/\/[^ \n]+)/g;
	const [, time] = new Date(tooltip).toLocaleDateString("en-US", { hour: "numeric", minute: "numeric" }).split(", ");

	return (
		<pre custom-tooltip={time}>
			{text.split(linkRegex).map((text, i) => {
				if (i % 2 === 0) return <span key={i}>{text}</span>;
				else return <LinkToImage key={i} link={text} />;
			})}
		</pre>
	);
}

const LinkToImage = ({ link }) => {
	const image = new Image();
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		image.src = link;
		image.onload = () => {
			setLoaded(true);
		};
	}, []);

	if (loaded) return <img className={style["image"]} src={link} alt="Image" />;
	else return <a href={link}>{link}</a>;
};

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
