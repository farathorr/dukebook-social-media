require("dotenv").config();
const express = require("express");
const cors = require("./middleware/cors");
const connectDB = require("./config/db");
const app = express();
const http = require("http").createServer(app);

connectDB();

app.use(express.json());
app.use(cors);

const socketIO = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:5000",
	},
});

//Add this before the app.get() block
socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("message", ({ data: key }) => {
		const f = (data) => {
			console.log(data);
			socket.off(key, f);
		};
		socket.on(key, f);
	});

	socket.on("disconnect", () => {
		console.log("🔥: A user disconnected");
	});
});

app.get("/", (req, res) => res.json({ message: "Welcome to the application." }));

app.use("/users", require("./routes/usersRouter"));
app.use("/posts", require("./routes/postsRouter"));

const PORT = process.env.PORT || 4000;
http.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
