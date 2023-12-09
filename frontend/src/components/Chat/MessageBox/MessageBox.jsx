import { useContext } from "react";
import { ChatContext } from "../Chat";
import style from "./MessageBox.module.scss";
import MessageRow from "../MessageRow/MessageRow";
import MessageSeparator from "../MessageSeparator/MessageSeparator";

export default function MessageBox({ messages }) {
	const { messagesBoxRef, scrollInfo } = useContext(ChatContext);

	const handleScroll = (event) => {
		scrollInfo.scrolledAtBottom = event.target.scrollHeight < event.target.scrollTop + event.target.clientHeight + 10;
	};

	return (
		<div className={style["message-box"]} onScroll={handleScroll} ref={messagesBoxRef}>
			{messages.map((message) => {
				if (message.type === "separator") return <MessageSeparator key={message._id} date={message.date} />;
				return <MessageRow key={message._id} id={message._id} name={message.sender?.userTag} {...message} />;
			})}
		</div>
	);
}
