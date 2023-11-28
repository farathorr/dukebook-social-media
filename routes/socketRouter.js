const socketController = require("../controllers/socketController");

function socketConnection(io) {
	return (socket) => {
		console.log(`⚡: ${socket.id} user just connected!`);

		socket.on("postUpdate", socketController.onPostUpdate(io, socket));
		socket.on("disconnect", socketController.onDisconnect(io, socket));
	};
}

module.exports = socketConnection;
