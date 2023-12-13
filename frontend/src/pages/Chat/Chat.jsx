import { useContext, useEffect, useRef, useState } from "react";
import style from "./Chat.module.scss";
import { AuthenticationContext } from "../../context/AuthenticationContext/AuthenticationContext";
import { api } from "../../utils/api";
import { formatDate } from "../../utils/formatDate";
import { createContext } from "react";
import { NotificationContext } from "../../context/NotificationControls/NotificationControls";
import { ChatGroupContext } from "../../context/ChatGroupContext/ChatGroupContext";
import ChatField from "./ChatField/ChatField";
import ChatHeader from "./ChatHeader/ChatHeader";
import Messages from "./Messages/Messages";

export const ChatContext = createContext(null);

const scrollInfo = {
	firstRender: true,
	scrolledAtBottom: true,
};

export default function Chat() {
	const [addNotification] = useContext(NotificationContext);
	const { authentication } = useContext(AuthenticationContext);
	const { group } = useContext(ChatGroupContext);
	const [messages, setMessages] = useState([]);
	const [newMessage, changeGroup] = api.useMessage(group?._id);

	const addNewMessage = (message) => {
		if (!group || message.groupId !== group._id) return;
		scrollInfo.firstRender = false;

		setMessages(groupMessage([...messages], message));
	};

	document.body.parentElement.onscroll = (event) => {
		scrollInfo.scrolledAtBottom = event.target.scrollHeight < event.target.scrollTop + event.target.clientHeight + 10;
	};

	useEffect(() => {
		if (!group) return;
		const fetchServices = async () => {
			const { status, data } = await api.getMessages(group._id);
			if (status !== 200) return addNotification({ type: "error", title: "Error", message: "Failed to fetch messages" });
			setMessages(data.reduce(groupMessage, []));
			scrollInfo.firstRender = true;
			changeGroup(group._id);
			sessionStorage.setItem("lastGroup", JSON.stringify(group));
		};

		fetchServices();
	}, [group]);

	useEffect(() => {
		if (!newMessage) return;
		scrollInfo.firstRender = false;
		console.log(newMessage);
		if (newMessage?.sender?._id === authentication.user?._id) return;
		addNewMessage(newMessage);
	}, [newMessage]);

	const scrollToBottom = () => {
		if (scrollInfo.firstRender || scrollInfo.scrolledAtBottom)
			window.document.body.parentNode.scrollTop = window.document.body.parentNode.scrollHeight;
	};

	useEffect(() => scrollToBottom());

	if (!authentication.isAuthenticated) return null;
	return (
		<ChatContext.Provider value={{ scrollToBottom, addNewMessage, scrollInfo }}>
			<div className={style["chat-page"]}>
				{group && <ChatHeader group={group} />}
				<Messages messages={messages} />
				{group && <ChatField groupId={group?._id} />}
			</div>
		</ChatContext.Provider>
	);
}

const groupMessage = (messages, { createdAt, text, ...message }) => {
	const lastMessage = messages.at(-1);
	const lastTime = lastMessage?.messages?.at(-1)?.date.raw ?? null;
	const [aTime, bTime] = [new Date(lastTime), new Date(createdAt)];
	const deltaTime = Math.abs(bTime - aTime) / 1000;
	const date = formatDate(createdAt);
	const differentDay =
		aTime.getDay() !== bTime.getDay() || aTime.getMonth() !== bTime.getMonth() || aTime.getFullYear() !== bTime.getFullYear();

	if (differentDay) messages.push({ date, type: "separator", _id: message._id + "separator" });

	if (!differentDay && deltaTime < 60 * 5 && lastMessage?.sender._id === message.sender._id) {
		lastMessage.messages.push({ date, text });
	} else messages.push({ ...message, messages: [{ date, text }], name: message.sender.userTag, date });

	return messages;
};
