const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const { User, SensitiveData } = require("../models/users");
const Image = require("../models/images");
const RefreshToken = require("../models/refreshToken");
const request = require("request").defaults({ encoding: null });

let token1 = null;
let token2 = null;

beforeAll(async () => {
	await SensitiveData.deleteMany({});
	await Image.deleteMany({});
	await User.deleteMany({});
	await RefreshToken.deleteMany({});
	await api.post("/api/users").send({ email: "test@mail.com", password: "R3g5T7#gh", userTag: "testUser" });
	await api.post("/api/users").send({ email: "test2@mail.com", password: "R3g5T7#gh", userTag: "testUser2" });

	const result1 = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser" });
	const result2 = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser2" });
	token1 = result1.body.accessToken;
	token2 = result2.body.accessToken;
});

describe("Test Images", () => {
	describe("POST /api/image", () => {
		it("Should return 401 with no token", async () => {
			const result = await api.post("/api/image").send({ image: "test" });

			expect(result.status).toBe(401);
		});

		it("Should return 400 with no image provided", async () => {
			const result = await api.post("/api/image").set("Authorization", "bearer " + token1);

			expect(result.status).toBe(400);
			expect(result.body).toHaveProperty("error", "No image provided");
		});

		it("Should return 500 with invalid image", async () => {
			const result = await api
				.post("/api/image")
				.set("Authorization", "bearer " + token1)
				.send({ image: "test" });

			expect(result.status).toBe(500);
			expect(result.body).toHaveProperty("error", "Error uploading image");
		});

		it("Should return 200 with upload image successfully", async () => {
			const imageData = "https://mugshag.com/cdn/shop/files/47944456-739d-417d-a046-eea8b10641de.jpg?v=1685972327&width=50";

			let resolveData = null;
			const data = new Promise((resolve, reject) => {
				resolveData = resolve;
			});

			request.get(imageData, (error, response, body) => {
				resolveData(Buffer.from(body).toString("base64"));
			});

			const result = await api
				.post("/api/image")
				.set("Authorization", "bearer " + token1)
				.send({ image: await data });

			expect(result.status).toBe(200);
			expect(result.body).toHaveProperty("user");
			expect(result.body).toHaveProperty("deleteHash");
			expect(result.body).toHaveProperty("url");
		});
	});

	describe("DELETE /api/image/:deleteHash", () => {
		it("Should return 401 with no token", async () => {
			const result = await api.delete("/api/image/test");

			expect(result.status).toBe(401);
		});

		it("Should return 404 with wrong credentials", async () => {
			const images = await Image.find({});
			expect(images.length).toBeGreaterThan(0);
			for (const image of images) {
				const deleteHash = image.deleteHash;
				const deleteResult = await api.delete("/api/image/" + deleteHash).set("Authorization", "bearer " + token2);

				expect(deleteResult.status).toBe(404);
			}
		});

		it("Should return 404 with invalid deleteHash", async () => {
			const result = await api.delete("/api/image/test").set("Authorization", "bearer " + token1);

			expect(result.status).toBe(404);
			expect(result.body).toHaveProperty("error", "Image not found");
		});

		it("Should return 200 with delete image successfully", async () => {
			const images = await Image.find({});
			expect(images.length).toBeGreaterThan(0);
			for (const image of images) {
				const deleteHash = image.deleteHash;
				const deleteResult = await api.delete("/api/image/" + deleteHash).set("Authorization", "bearer " + token1);

				expect(deleteResult.status).toBe(200);
			}
		});
	});
});

afterAll(async () => {
	mongoose.connection.close();
});
