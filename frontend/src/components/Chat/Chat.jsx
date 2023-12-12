import { useContext, useEffect, useRef, useState } from "react";
import style from "./Chat.module.scss";
import image from "../../images/Duke3D.png";
import FriendRow from "./FriendRow/FriendRow";
import { AuthenticationContext } from "../../context/AuthenticationContext/AuthenticationContext";
import { api } from "../../api";
import { formatDate } from "../../utils/formatDate";
import { createContext } from "react";
import ChatFrame from "./ChatFrame/ChatFrame";

export const ChatContext = createContext(null);

const scrollInfo = {
	firstRender: true,
	scrolledAtBottom: true,
};

export default function Chat() {
	const { authentication } = useContext(AuthenticationContext);
	const [messageGroups, setMessageGroups] = useState([]);
	const [messages, setMessages] = useState([]);
	const [group, setGroup] = useState(JSON.parse(sessionStorage.getItem("lastGroup")) || null);
	const [newMessage, changeGroup] = api.useMessage(group?._id);
	const messagesBoxRef = useRef(null);

	const addNewMessage = (message) => {
		if (!group || message.groupId !== group._id) return;
		scrollInfo.firstRender = false;

		setMessages(groupMessage([...messages], message));
	};

	useEffect(() => {
		if (!authentication.isAuthenticated) return;
		const fetchServices = async () => {
			const { status, data } = await api.getMessageGroups();
			if (status === 200) setMessageGroups(data);
		};

		fetchServices();
	}, [authentication]);

	useEffect(() => {
		if (!group) return;
		const fetchServices = async () => {
			const { status, data } = await api.getMessages(group._id);
			if (status === 200) setMessages(data.reduce(groupMessage, []));
			scrollInfo.firstRender = true;
			changeGroup(group._id);
			sessionStorage.setItem("lastGroup", JSON.stringify(group));
		};

		fetchServices();
	}, [group]);

	useEffect(() => {
		if (!newMessage) return;
		scrollInfo.firstRender = false;
		if (newMessage?.sender?._id === authentication.user?._id) return;
		addNewMessage(newMessage);
	}, [newMessage]);

	const scrollToBottom = () => {
		if (messagesBoxRef.current && (scrollInfo.firstRender || scrollInfo.scrolledAtBottom))
			messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
	};

	useEffect(() => scrollToBottom());

	if (!authentication.isAuthenticated) return null;
	return (
		<ChatContext.Provider value={{ scrollToBottom, addNewMessage, scrollInfo, messagesBoxRef }}>
			<div className={style["chat-page"]}>
				<main className={style["page-content"]}>
					<div className={style["friend-list"]}>
						{messageGroups.map((group) => (
							<FriendRow key={group._id} setGroup={setGroup} group={group} />
						))}
					</div>
					<ChatFrame group={group} messages={messages} />
				</main>
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
