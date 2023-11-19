const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "Welcome to the application." });
});

//middleware
app.use(cors());
app.use("/posts", require("./routes/postsRouter"));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
