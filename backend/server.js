require("dotenv").config();
const express = require("express");
const cors = require("./middleware/cors");
const connectDB = require("./config/db");
const app = express();
const http = require("http").createServer(app);
const socketIO = require("socket.io")(http, { cors: { origin: "http://localhost:5000" } });
module.exports = { socketIO };
const errorHandler = require("./middleware/errorMiddleware");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger.json");

connectDB();

app.use(express.json({ limit: "50mb" }));
app.use(cors);

socketIO.on("connection", require("./routes/socketRouter"));

app.use("/api/messages", require("./routes/messagesRouter"));
app.use("/api/users", require("./routes/usersRouter"));
app.use("/api/posts", require("./routes/postsRouter"));
app.use("/api/profile", require("./routes/profileRouter"));
app.use("/api/image", require("./routes/imageRoutes"));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get("/", (req, res) => res.json({ message: "Welcome to the application." }));

app.use(errorHandler.errorHandler);
app.use(errorHandler.unknownEndpoint);

const PORT = process.env.PORT || 4000;
http.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
