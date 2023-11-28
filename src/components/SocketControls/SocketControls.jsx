import socketIO from "socket.io-client";
import { createContext } from "react";

const socket = socketIO.connect("http://localhost:4000");
export const SocketContext = createContext(null);

export default function SocketControls(props) {
	return <SocketContext.Provider value={[socket]} {...props} />;
}
