import { useContext } from "react";
import { ChatContext } from "../Chat";
import style from "./Messages.module.scss";
import MessageRow from "./MessageRow/MessageRow";
import MessageSeparator from "./MessageSeparator/MessageSeparator";

export default function Messages({ messages }) {
	return (
		<div className={style["message-box"]}>
			{messages.map((message) => {
				if (message.type === "separator") return <MessageSeparator key={message.date.longDate} date={message.date} />;
				return <MessageRow key={message._id} message={message} />;
			})}
		</div>
	);
}
