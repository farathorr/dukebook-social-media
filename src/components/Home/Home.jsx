import { useEffect } from "react";

export default function Home({ socket }) {
	socket.emit("message", { data: "home", socketID: socket.id });

	useEffect(() => {
		// socket.on("home", (data) => {
		// 	console.log(data);
		// });

		setTimeout(() => {
			socket.emit("home", { data: ".5 sekunttii", socketID: socket.id });
		}, 500);
		setTimeout(() => {
			socket.emit("home", { data: "5 sekunttii", socketID: socket.id });
		}, 5000);

		// return () => {
		// 	socket.off("home");
		// }
	});

	console.log("???");

	return <div>Home</div>;
}
