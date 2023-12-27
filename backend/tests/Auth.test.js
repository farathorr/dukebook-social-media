const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const { User, SensitiveData } = require("../models/users");
const RefreshToken = require("../models/refreshToken");

let refreshToken = null;

beforeAll(async () => {
	await SensitiveData.deleteMany({});
	await User.deleteMany({});
	await RefreshToken.deleteMany({});
	await api.post("/api/users").send({ email: "test@mail.com", password: "R3g5T7#gh", userTag: "testUser" });
});

describe("Authentication API Tests", () => {
	beforeEach(async () => {
		const result = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser" });

		refreshToken = result.body.refreshToken;
	});

	describe("POST /api/auth/login", () => {
		it("should log in a user and return tokens", async () => {
			const response = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser" });
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("accessToken");
			expect(response.body).toHaveProperty("refreshToken");
			expect(response.body).toHaveProperty("user");
		});

		it("should return 404 if user is not found", async () => {
			const response = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser2" });
			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("message");
		});

		it("should return 400 for invalid credentials", async () => {
			const response = await api.post("/api/auth/login").send({ password: "wrong_password", userTag: "testUser" });
			expect(response.status).toBe(400);
			expect(response.body.message).toBe("Invalid credentials.");
		});

		it("should delete old refresh token and create a new one", async () => {
			// jwt.sign() uses the current time in seconds as the iat claim, so we need to wait a second before creating a new token
			// Otherwise, the new token will have the same iat claim as the old one
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const response = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser" });
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("refreshToken");
			const refreshResponse = await api.post("/api/auth/refresh").send({ token: response.body.refreshToken });
			expect(refreshResponse.status).toBe(200);
			const oldRefreshResponse = await api.post("/api/auth/refresh").send({ token: refreshToken });
			expect(oldRefreshResponse.status).toBe(403);
		});
	});

	describe("POST /api/auth/refresh", () => {
		it("should refresh access token", async () => {
			const response = await api.post("/api/auth/refresh").send({ token: refreshToken });
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("accessToken");
			expect(response.body).toHaveProperty("user");
		});

		it("should return 401 if no refresh token provided", async () => {
			const response = await api.post("/api/auth/refresh");
			expect(response.status).toBe(401);
		});

		it("should return 403 for an invalid refresh token", async () => {
			const response = await api.post("/api/auth/refresh").send({ token: "invalid_token" });
			expect(response.status).toBe(403);
		});
	});

	describe("POST /api/auth/logout", () => {
		it("should log out a user and remove refresh token", async () => {
			const response = await api.post("/api/auth/logout").send({ token: refreshToken });
			expect(response.status).toBe(200);
			const refreshResponse = await api.post("/api/auth/refresh").send({ token: refreshToken });
			expect(refreshResponse.status).toBe(403);
			const tokenCount = await RefreshToken.find({});
			expect(tokenCount).toHaveLength(0);
		});

		it("should return 401 if no refresh token provided", async () => {
			const response = await api.post("/api/auth/logout");
			expect(response.status).toBe(401);
		});
	});
});

afterAll(() => {
	mongoose.connection.close();
});
