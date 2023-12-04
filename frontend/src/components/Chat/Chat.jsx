import { useContext, useEffect, useState } from "react";
import style from "./Chat.module.scss";
import image from "../../images/Duke3D.png";
import FriendRow from "./FriendRow/FriendRow";
import MessageRow from "./MessageRow/MessageRow";
import MessageSeparator from "./MessageSeparator/MessageSeparator";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import { api } from "../../api";

export default function Chat() {
	const [authentication] = useContext(AuthenticationContext);
	const [messageGroups, setMessageGroups] = useState([]);
	const [messages, setMessages] = useState([]);
	const [groupId, setGroupId] = useState(null);

	useEffect(() => {
		if (!authentication.isAuthenticated) return;
		const fetchServices = async () => {
			const { status, data } = await api.getMessageGroups();
			if (status === 200) setMessageGroups(data);
		};

		fetchServices();
	}, [authentication]);

	useEffect(() => {
		if (!groupId) return;
		const fetchServices = async () => {
			const { status, data } = await api.getMessages(groupId);
			console.log(data);
			console.log(formatMessages(data));
			if (status === 200) setMessages(formatMessages(data));
		};

		fetchServices();
	}, [groupId]);

	if (!authentication.isAuthenticated) return null;
	return (
		<div className={style["chat-page"]}>
			<main className={style["page-content"]}>
				<div className={style["friend-list"]}>
					{messageGroups.map((group) => (
						<FriendRow
							key={group._id}
							onClick={() => setGroupId(group._id)}
							name={group.name}
							lastMessage={group.lastMessage}
							image={image}
						/>
					))}
				</div>
				<div className={style["chat-frame"]}>
					<div className={style["chat-bar"]}>
						<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
						<div className={style["bar-user-info-container"]}>
							<span className={style["user-name"]}>Duke</span>
							<div className={style["user-status-indicator"]} />
							<span className={style["user-status"]}>Online</span>
						</div>
					</div>
					<div className={style["message-box"]}>
						{messages.map((message) => (
							<MessageRow key={message._id} name={message.sender.userTag} date={message.date} messages={message.messages} />
						))}
						{/* <MessageRow name="Kassu" date="Today at 15:20" messages={["k", "lol"]} />
						<MessageRow
							name="Duke"
							date="Today at 15:23"
							messages={[
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl urna, porta vitae mauris nec, feugiat placerat ante. Vestibulum vitae dui id",
								"euismod. Nam et mauris laoreet dolor accumsan volutpat non sit amet diam. Maecenas aliquet nibh justo, eget vulputate ante eleifend ut.",
								"Proin bibendum in",
								"Sed lobortis vel magna a mattis. Cras tempus elit eget enim maximus, at egestas ipsum volutpat. Nullam pharetra condimentum eros, ac luctus dui malesuada at. Vestibulum nunc sem, ullamcorper vitae augue sit amet, varius finibus felis. Donec non auctor dui. Sed eleifend sit amet mauris nec mollis. Vivamus ac metus id tortor imperdiet varius non ac enim. Ut bibendum neque ut ligula ornare pellentesque. Nullam congue massa ac nisi molestie suscipit. Proin dapibus dui libero, eget mollis velit malesuada eget. Morbi sem justo, maximus nec tristique eget, laoreet nec nisl. Nam nec purus lorem. Nam ut justo eget dolor malesuada lacinia. Vivamus sollicitudin dui non tempor semper. Praesent ut venenatis ipsum. Ut eget mi et orci ultrices porttitor.",
							]}
						/>
						<MessageRow name="Slayer69" date="Today at 15:55" messages={["k nerd."]} />
						<MessageSeparator date="17 November 2023" />
						<MessageRow name="Kassu" date="Today at 15:20" messages={["k", "lol"]} />

						<MessageRow
							name="Duke"
							date="Today at 15:23"
							messages={[
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nisl urna, porta vitae mauris nec, feugiat placerat ante. Vestibulum vitae dui id",
								"euismod. Nam et mauris laoreet dolor accumsan volutpat non sit amet diam. Maecenas aliquet nibh justo, eget vulputate ante eleifend ut.",
								"Proin bibendum in",
								"Sed lobortis vel magna a mattis. Cras tempus elit eget enim maximus, at egestas ipsum volutpat. Nullam pharetra condimentum eros, ac luolestie suscipit. Proin dlesuada lacinia. Vivamus sollicitudin dui non tempor semper. Praesent ut venenatis ipsum. Ut eget mi et orci ultrices porttitor.",
							]}
						/>
						<MessageSeparator date="18 November 2023" />
						<MessageRow name="Slayer69" date="Today at 15:55" messages={["k nerd."]} />
						<MessageRow name="Slayer69" date="Today at 15:56" messages={["k nerd."]} />
						<MessageRow name="Slayer69" date="Today at 15:57" messages={["k nerd."]} />
						<MessageRow name="Slayer69" date="Today at 15:58" messages={["k nerd."]} />
						<MessageRow name="Slayer69" date="Today at 15:59" messages={["k nerd."]} />
						<MessageRow name="Slayer69" date="Today at 16:00" messages={["k nerd."]} /> */}
					</div>
					<form className={style["chat-input"]}>
						<textarea
							className={style["text-field"]}
							name="message"
							placeholder="Type a message..."
							onInput={(e) => {
								const input = e.target;
								input.style.height = "";
								input.style.height = input.scrollHeight + "px";
							}}
							defaultValue={""}
						/>
						<button className={style["send-button"]}>Send</button>
						<button className={style["attach-button"]}>Attach</button>
					</form>
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

		if (!lastMessage || lastMessage?.sender._id !== message.sender._id) {
			formattedMessages.push({ ...message, messages: [text], name: message.sender.userTag, date: createdAt });
		} else {
			const [aTime, bTime] = [new Date(lastDate), new Date(createdAt)];
			const deltaTime = Math.abs(bTime - aTime) / 1000;

			if (deltaTime < 60 * 5) lastMessage.messages.push(text);
		}

		lastDate = createdAt;
	});

	return formattedMessages;
}
