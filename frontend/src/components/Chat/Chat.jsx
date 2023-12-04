import { useContext, useEffect, useRef, useState } from "react";
import style from "./Chat.module.scss";
import image from "../../images/Duke3D.png";
import FriendRow from "./FriendRow/FriendRow";
import MessageRow from "./MessageRow/MessageRow";
import MessageSeparator from "./MessageSeparator/MessageSeparator";
import ChatField from "./ChatField/ChatField";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import { api } from "../../api";

let scrolledAtBottom = true;
export default function Chat() {
	const [authentication] = useContext(AuthenticationContext);
	const [messageGroups, setMessageGroups] = useState([]);
	const [messages, setMessages] = useState([]);
	const [group, setGroup] = useState(null);
	const [newMessage, changeGroup] = api.useMessage(group?._id);
	const [update, setUpdate] = useState(false);
	const messagesBoxRef = useRef(null);

	const addNewMessage = ({ createdAt, text, ...message }) => {
		if (!group) return;
		if (message.groupId !== group._id) return;

		const lastMessage = messages.at(-1);
		const lastTime = lastMessage?.messages?.at(-1)?.date ?? null;
		const [aTime, bTime] = [new Date(lastTime), new Date(createdAt)];
		const deltaTime = Math.abs(bTime - aTime) / 1000;

		if (deltaTime < 60 * 5 && lastMessage?.sender._id === message.sender._id) {
			lastMessage.messages.push({ date: createdAt, text });
		} else messages.push({ ...message, messages: [{ date: createdAt, text }], name: message.sender.userTag, date: createdAt });

		setMessages([...messages]);
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
			if (status === 200) setMessages(formatMessages(data));
			changeGroup(group._id);
		};

		fetchServices();
	}, [group]);

	useEffect(() => {
		if (!newMessage) return;
		if (newMessage?.sender?._id === authentication.user?.userId) return;
		addNewMessage(newMessage);
	}, [newMessage]);

	useEffect(() => {
		if (scrolledAtBottom && messagesBoxRef.current) messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
	});

	const handleScroll = ({ target }) => {
		scrolledAtBottom = target.scrollHeight < target.scrollTop + target.clientHeight + 10;
	};

	if (!authentication.isAuthenticated) return null;
	return (
		<div className={style["chat-page"]}>
			<main className={style["page-content"]}>
				<div className={style["friend-list"]}>
					{messageGroups.map((group) => (
						<FriendRow key={group._id} onClick={() => setGroup(group)} name={group.name} lastMessage={group.lastMessage} image={image} />
					))}
				</div>
				<div className={style["chat-frame"]}>
					<div className={style["chat-bar"]}>
						<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
						<div className={style["bar-user-info-container"]}>
							<span className={style["user-name"]}>{group?.name}</span>
							<div className={style["user-status-indicator"]} />
							<span className={style["user-status"]}>Online</span>
						</div>
					</div>
					<div className={style["message-box"]} onScroll={handleScroll} ref={messagesBoxRef}>
						{messages.map((message) => (
							<MessageRow key={message._id} name={message.sender.userTag} date={message.date} messages={message.messages} />
						))}

						{/* <MessageSeparator date="18 November 2023" /> */}
					</div>
					<ChatField groupId={group?._id} setUpdate={addNewMessage} />
				</div>
			</main>
		</div>
	);
}

function formatMessages(messages) {
	const formattedMessages = [];
	let lastDate = null;
	messages.forEach(({ createdAt, text, ...message }) => {
		const lastMessage = formattedMessages.at(-1);
		const [aTime, bTime] = [new Date(lastDate), new Date(createdAt)];
		const deltaTime = Math.abs(bTime - aTime) / 1000;
		lastDate = createdAt;

		if (deltaTime < 60 * 5 && lastMessage?.sender._id === message.sender._id) {
			lastMessage.messages.push({ date: createdAt, text });
			return;
		}

		formattedMessages.push({ ...message, messages: [{ date: createdAt, text }], name: message.sender.userTag, date: createdAt });
	});

	return formattedMessages;
}
