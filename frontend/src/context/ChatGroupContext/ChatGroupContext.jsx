import { createContext, useState } from "react";

export const ChatGroupContext = createContext(null);

export default function ChatProvider(props) {
	const [group, setGroup] = useState(JSON.parse(sessionStorage.getItem("lastGroup")) || null);
	return <ChatGroupContext.Provider value={{ group, setGroup }} {...props} />;
}
