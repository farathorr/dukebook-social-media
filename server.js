require("dotenv").config();
const express = require("express");
const cors = require("./middleware/cors");
const connectDB = require("./config/db");
const app = express();
const http = require("http").createServer(app);
const socketIO = require("socket.io")(http, { cors: { origin: "http://localhost:5000" } });
module.exports = { socketIO };

connectDB();

app.use(express.json());
app.use(cors);

socketIO.on("connection", require("./routes/socketRouter"));

app.get("/", (req, res) => res.json({ message: "Welcome to the application." }));

app.use("/users", require("./routes/usersRouter"));
app.use("/posts", require("./routes/postsRouter"));

const PORT = process.env.PORT || 4000;
http.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
