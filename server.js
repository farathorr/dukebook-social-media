const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "Welcome to the application." });
});

app.use("/posts", require("./routes/postsRouter"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
