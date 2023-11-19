require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
	console.log("Connecting to MongoDB...");
	const conn = await mongoose.connect(process.env.MONGO_URI);
	console.log("MongoDB connected");
};

module.exports = connectDB;
