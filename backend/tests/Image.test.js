const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const { User, SensitiveData } = require("../models/users");
const RefreshToken = require("../models/refreshToken");
const ImageScheme = require("../models/images");
const clientId = process.env.CLIENT_ID;

let token = null;

beforeAll(async () => {
	await SensitiveData.deleteMany({});
	await User.deleteMany({});
	await RefreshToken.deleteMany({});

	const result = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser" });
	token = result.body.accessToken;
});

describe("Test uploadImage", () => {
	it("Should upload image successfully", async () => {
		const imageData = "https://mugshag.com/cdn/shop/files/47944456-739d-417d-a046-eea8b10641de.jpg?v=1685972327&width=1946"; // Replace with actual image data

		const result = await api
			.post("/api/uploadImage")
			.set("Authorization", "bearer " + token)
			.send({ image: imageData });

		expect(result.status).toBe(200);
		expect(result.body).toHaveProperty("user");
	});

	it("Should return 400 with no image provided", async () => {
		const result = await api.post("/api/uploadImage").set("Authorization", "bearer " + token);

		expect(result.status).toBe(400);
		expect(result.body).toHaveProperty("error", "No image provided");
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});
});
