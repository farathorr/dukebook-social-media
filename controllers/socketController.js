function onPostUpdate(io, socket) {
	return ({ postId, likes, dislikes }) => {
		io.emit("post/" + postId, { likes, dislikes });
	};
}

function onDisconnect(io, socket) {
	return () => {
		console.log("🔥: A user disconnected");
	};
}

module.exports = {
	onPostUpdate,
	onDisconnect,
};
