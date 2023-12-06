import { useContext, useEffect, useState } from "react";
import style from "./MessageRow.module.scss";
import { ChatContext } from "../Chat";

export default function MessageRow({ image, name, date, messages }) {
	const { scrollToBottom } = useContext(ChatContext);

	return (
		<div className={style["message-row"]}>
			<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
			<div className={style["message-content"]}>
				<span className={style["message-user-name"]}>{name} </span>
				<span className={style["message-date"]}>{date.shortFullDate}</span>

				{messages.map((message, index) => (
					<MessageText key={index} text={message.text} tooltip={message.date.time} />
				))}
			</div>
		</div>
	);

	function MessageText({ text, tooltip }) {
		const linkRegex = /(https?:\/\/[^ \n]+)/g;

		return (
			<pre custom-tooltip={tooltip}>
				{text.split(linkRegex).map((text, i) => {
					if (!text.length) return null;
					if (i % 2 === 0) return <span key={i}>{text}</span>;
					else return <LinkToImage key={i} link={text} />;
				})}
			</pre>
		);
	}

	function LinkToImage({ link }) {
		const image = new Image();
		const [loaded, setLoaded] = useState(false);

		useEffect(() => {
			image.src = link;
			image.onload = () => setLoaded(true);
		}, []);

		if (loaded) return <img className={style["image"]} src={link} alt="Image" onLoad={scrollToBottom} />;
		else return <a href={link}>{link}</a>;
	}
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
