const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const { User, SensitiveData } = require("../models/users");
const RefreshToken = require("../models/refreshToken");

let token = null;

beforeAll(async () => {
	await SensitiveData.deleteMany({});
	await User.deleteMany({});
	await RefreshToken.deleteMany({});
	await api.post("/api/users").send({ email: "test@mail.com", password: "R3g5T7#gh", userTag: "testUser" });
	await api.post("/api/users").send({ email: "test2@mail.com", password: "R3g5T7#gh", userTag: "testUser2" });

	const result = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser" });
	await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser2" });
	token = result.body.accessToken;
});

describe("Test profile", () => {
	describe("GET /api/profile", () => {
		it("should return 401 with no authentication", async () => {
			await api.get("/api/profile").expect(401);
		});

		it("should return profile info", async () => {
			const response = await api.get("/api/profile").set("Authorization", `bearer ${token}`).expect(200);
			expect(response.body).toHaveProperty("username");
			expect(response.body).toHaveProperty("userTag");
			expect(response.body.userTag).toBe("testUser");
		});
	});

	describe("PATCH /api/profile", () => {
		it("should return 401 with no authentication", async () => {
			await api.patch("/api/profile").expect(401);
		});

		it("should return 400 with no data", async () => {
			await api.patch("/api/profile").set("Authorization", `bearer ${token}`).expect(400);
		});

		it("should return 409 with existing userTag", async () => {
			await api.patch("/api/profile").set("Authorization", `bearer ${token}`).send({ userTag: "testUser2" }).expect(409);
		});

		it("should return 200 with updated userTag", async () => {
			const response = await api.patch("/api/profile").set("Authorization", `bearer ${token}`).send({ userTag: "testUser3" }).expect(200);
			expect(response.body).toHaveProperty("userTag");
			expect(response.body.userTag).toBe("testUser3");
		});

		it("should return 200 with updated username", async () => {
			const response = await api.patch("/api/profile").set("Authorization", `bearer ${token}`).send({ username: "testUser3" }).expect(200);
			expect(response.body).toHaveProperty("username");
			expect(response.body.username).toBe("testUser3");
		});

		it("should return 200 with updated bio", async () => {
			const response = await api.patch("/api/profile").set("Authorization", `bearer ${token}`).send({ bio: "testUser3" }).expect(200);
			expect(response.body).toHaveProperty("bio");
			expect(response.body.bio).toBe("testUser3");
		});

		it("should return 200 with updated profilePicture", async () => {
			const response = await api
				.patch("/api/profile")
				.set("Authorization", `bearer ${token}`)
				.send({ profilePicture: "testUser3" })
				.expect(200);
			expect(response.body).toHaveProperty("profilePicture");
			expect(response.body.profilePicture).toBe("testUser3");
		});
	});
});

afterAll(() => {
	mongoose.connection.close();
});
