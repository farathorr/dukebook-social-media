const jwt = require("jsonwebtoken");
const { socketIO } = require("../server");

const socketConnection = (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	// Public socket here

	socket.on("disconnect", () => {
		console.log(`🔥: A user ${socket.id} disconnected`);
	});

	// const token = socket.handshake.auth.token;
	// if (!token) return;

	// jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
	// 	if (err) return console.log("Authentication error");

	// 	// Private authenticated socket here

	// 	socket.on("postUpdate", ({ postId, likes, dislikes }) => {
	// 		console.log(`🔥: post/${postId} updated`);
	// 		socketIO.emit("post/" + postId, { likes, dislikes });
	// 	});
	// });
};

module.exports = socketConnection;
