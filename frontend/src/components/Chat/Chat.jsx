import { useContext, useEffect, useRef, useState } from "react";
import style from "./Chat.module.scss";
import image from "../../images/Duke3D.png";
import FriendRow from "./FriendRow/FriendRow";
import MessageRow from "./MessageRow/MessageRow";
import MessageSeparator from "./MessageSeparator/MessageSeparator";
import ChatField from "./ChatField/ChatField";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import { api } from "../../api";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";

let scrolledAtBottom = true;
export default function Chat() {
	const [authentication] = useContext(AuthenticationContext);
	const [messageGroups, setMessageGroups] = useState([]);
	const [messages, setMessages] = useState([]);
	const [group, setGroup] = useState(JSON.parse(sessionStorage.getItem("lastGroup")) || null);
	const [newMessage, changeGroup] = api.useMessage(group?._id);
	const messagesBoxRef = useRef(null);

	const addNewMessage = ({ createdAt, text, ...message }) => {
		if (!group) return;
		if (message.groupId !== group._id) return;

		const lastTime = lastMessage?.messages?.at(-1)?.date ?? null;
		const [aTime, bTime] = [new Date(lastTime), new Date(createdAt)];
		const deltaTime = Math.abs(bTime - aTime) / 1000;
		const date = formatDate(createdAt);
		const lastMessage = messages.at(-1);
		const differentDay =
			aTime.getDay() !== bTime.getDay() || aTime.getMonth() !== bTime.getMonth() || aTime.getFullYear() !== bTime.getFullYear();

		if (differentDay) lastMessage.push({ date, type: "separator", _id: message._id + "separator" });

		if (!differentDay && deltaTime < 60 * 5 && lastMessage?.sender._id === message.sender._id) {
			lastMessage.messages.push({ date, text });
		} else messages.push({ ...message, messages: [{ date, text }], name: message.sender.userTag, date });

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
			sessionStorage.setItem("lastGroup", JSON.stringify(group));
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
		console.log("scrolledAtBottom", scrolledAtBottom);
	});

	const handleScroll = (event) => {
		scrolledAtBottom = event.target.scrollHeight < event.target.scrollTop + event.target.clientHeight + 10;
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
					{group && (
						<div className={style["chat-bar"]}>
							<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
							<div className={style["bar-user-info-container"]}>
								<Link className={style["user-name"]} to={`/user/${group?.name}`}>
									@{group?.name}
								</Link>
								<div className={style["user-status-indicator"]} />
								<span className={style["user-status"]}>Online</span>
							</div>
						</div>
					)}
					<div className={style["message-box"]} onScroll={handleScroll} ref={messagesBoxRef}>
						{messages.map((message) => {
							if (message.type === "separator") return <MessageSeparator key={message._id} date={message.date} />;
							return <MessageRow key={message._id} name={message.sender?.userTag} date={message.date} messages={message.messages} />;
						})}
					</div>
					{group && <ChatField groupId={group?._id} setUpdate={addNewMessage} />}
				</div>
			</main>
		</div>
	);
}

function formatMessages(messages) {
	const formattedMessages = [];
	let lastDate = null;

	messages.forEach(({ createdAt, text, ...message }) => {
		const [aTime, bTime] = [new Date(lastDate), new Date(createdAt)];
		const deltaTime = Math.abs(bTime - aTime) / 1000;
		const date = formatDate(createdAt);
		lastDate = createdAt;

		if (aTime.getDay() !== bTime.getDay() || aTime.getMonth() !== bTime.getMonth() || aTime.getFullYear() !== bTime.getFullYear()) {
			formattedMessages.push({ date, type: "separator", _id: message._id + "separator" });
		}

		const lastMessage = formattedMessages.at(-1);
		if (deltaTime < 60 * 5 && lastMessage?.sender._id === message.sender._id) {
			lastMessage.messages.push({ date, text });
			return;
		}

		formattedMessages.push({ ...message, messages: [{ date, text }], name: message.sender.userTag, date });
	});

	return formattedMessages;
}
