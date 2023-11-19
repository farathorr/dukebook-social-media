const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.json({ message: "Welcome to the application." }));

app.use("/users", require("./routes/usersRouter"));
app.use("/posts", require("./routes/postsRouter"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
