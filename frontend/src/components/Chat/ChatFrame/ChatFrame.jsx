import ChatField from "./ChatField/ChatField";
import ChatHeader from "./ChatHeader/ChatHeader";
import Messages from "./Messages/Messages";
import style from "./ChatFrame.module.scss";

export default function ChatFrame({ group, image, messages }) {
	return (
		<div className={style["chat-frame"]}>
			{group && <ChatHeader image={image} name={group?.name} />}
			<Messages messages={messages} />
			{group && <ChatField groupId={group?._id} />}
		</div>
	);
}
