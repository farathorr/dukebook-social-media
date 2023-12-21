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

	const result = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser" });
	token = result.body.accessToken;

	await api.put("/api/users/follow/testUser").set("Authorization", `bearer ${token}`);
});

describe("Profile Controller", () => {
	it("GET /api/profile should return the authenticated user's information", async () => {
		const response = await api.get("/api/profile").set("Authorization", `bearer ${token}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("userTag", "testUser");
	});

	it("PATCH /api/profile should update the authenticated user's profile", async () => {
		const updatedProfile = { username: "newUsername", bio: "New bio" };
		const response = await api.patch("/api/profile").set("Authorization", `bearer ${token}`).send(updatedProfile);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("username", "newUsername");
		expect(response.body).toHaveProperty("bio", "New bio");
	});

	it("PATCH /api/profile should handle conflicts when UserTag already exists", async () => {
		const conflictingProfile = { userTag: "testUser" }; // Use an existing UserTag
		const response = await api.patch("/api/profile").set("Authorization", `bearer ${token}`).send(conflictingProfile);
		expect(response.status).toBe(409);
		expect(response.body).toHaveProperty("message", "UserTag already exists.");
	});
});

afterAll(() => {
	mongoose.connection.close();
});
