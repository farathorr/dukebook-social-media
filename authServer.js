require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const { unknownEndpoint } = require("./middleware/errorMiddleware");

connectDB();

app.use(express.json());
app.use(cors());

app.use("/auth", require("./routes/authRouter"));
app.use("/", unknownEndpoint);

const PORT = process.env.AUTH_PORT || 1000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
