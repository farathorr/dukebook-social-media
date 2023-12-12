import { useContext, useEffect, useMemo, useState } from "react";
import style from "./MessageRow.module.scss";
import { ChatContext } from "../../../Chat";
import UserPicture from "../../../../../components/UserPicture/UserPicture";

export default function MessageRow({ message }) {
	const memorizedMessageRow = useMemo(() => {
		return (
			<div className={style["message-row"]}>
				<UserPicture src={message.sender.profilePicture} size="small" />

				<MessageContent name={message.sender.userTag} date={message.date} messages={message.messages} />
			</div>
		);
	}, [message._id, message.messages.length]);

	return <>{memorizedMessageRow}</>;
}

function MessageContent({ name, date, messages }) {
	const [firstMessage, ...restMessages] = messages;
	return (
		<div className={style["message-content"]}>
			<pre>
				<div className={style["message-header"]}>
					<span className={style["message-user-name"]}>{name} </span>
					<span className={style["message-date"]}>{date.shortFullDate}</span>
				</div>
				<MessageText text={firstMessage.text} />
			</pre>
			{restMessages.map((message, i) => (
				<pre custom-tooltip={message.date.time} key={i}>
					<MessageText text={message.text} />
				</pre>
			))}
		</div>
	);
}

function MessageText({ text }) {
	const linkRegex = /(https?:\/\/[^ \n]+)/g;

	return (
		<>
			{text.split(linkRegex).map((text, i) => {
				if (!text.length) return null;
				if (i % 2 === 0) return <span key={i}>{text}</span>;
				else return <MemorizedLinkToImage key={i} link={text} />;
			})}
		</>
	);
}

function MemorizedLinkToImage({ link }) {
	return useMemo(() => <LinkToImage link={link} />, [link]);
}

function LinkToImage({ link }) {
	const { scrollToBottom } = useContext(ChatContext);
	const image = new Image();
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		image.src = link;
		image.onload = () => setLoaded(true);
	}, []);

	if (loaded) return <img className={style["image"]} src={link} alt="Image" onLoad={scrollToBottom} />;
	else return <a href={link}>{link}</a>;
}
