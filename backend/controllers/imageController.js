const axios = require("axios");
const ImageScheme = require("../models/images");
const clientId = process.env.CLIENT_ID;

const uploadImage = async (req, res) => {
	const { image } = req.body;
	const { userId } = req.user;

	if (!image) {
		return res.status(400).json({ error: "No image provided" });
	}

	try {
		const imageData = await postToImgur(image);
		// console.log(imageData);
		const imageObject = await ImageScheme.create({ user: userId, ...imageData });

		res.json(imageObject);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Error uploading image" });
	}
};

const deleteImage = async (req, res) => {
	const { deleteHash } = req.params;

	if (!deleteHash) {
		return res.status(400).json({ error: "No deleteHash provided" });
	}

	try {
		const imageData = await deleteFromImgur(deleteHash);
		res.json(imageData);
	} catch (err) {
		res.status(500).json({ error: "Error uploading image" });
	}
};

async function postToImgur(base64Image) {
	const headers = { Authorization: `Client-ID ${clientId}` };

	try {
		const response = await axios.post("https://api.imgur.com/3/image", { image: base64Image, type: "base64" }, { headers });
		console.log("Imgur API Response:", response.data.data);

		return { url: response.data.data.link, deleteHash: response.data.data.deletehash };
	} catch (error) {
		console.error("Error uploading to Imgur:", error.response.data);
		throw error;
	}
}

async function deleteFromImgur(deleteHash) {
	const headers = { Authorization: `Client-ID ${clientId}` };

	try {
		const response = await axios.delete("https://api.imgur.com/3/image/" + deleteHash + ".json", { headers });
		console.log("Imgur API Response:", response.data.data);

		return response.data.data;
	} catch (error) {
		console.error("Error uploading to Imgur:", error.response.data);
		throw error;
	}
}

module.exports = {
	uploadImage,
	deleteImage,
};
