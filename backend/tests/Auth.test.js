const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const { User, SensitiveData } = require("../models/users");
const RefreshToken = require("../models/refreshToken");
const jwt = require("jsonwebtoken");

let token = null;

beforeAll(async () => {
	await SensitiveData.deleteMany({});
	await User.deleteMany({});
	await RefreshToken.deleteMany({});
	await api.post("/api/users").send({ email: "test@mail.com", password: "R3g5T7#gh", userTag: "testUser" });
	const result1 = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser" });

	token = result1.body.accessToken;

	await api.put("/api/users/follow/testUser").set("Authorization", "bearer " + token);
});

describe("Authentication API Tests", () => {
	describe("POST /api/auth/login", () => {
		it("should log in a user and return tokens", async () => {
			// Your test logic for login route
		});

		it("should return 404 if user is not found", async () => {
			// Your test logic for login route with a non-existing user
		});

		it("should return 400 for invalid credentials", async () => {
			// Your test logic for login route with invalid credentials
		});

		// Add more test cases as needed
	});

	describe("POST /api/auth/refresh", () => {
		it("should refresh access token", async () => {
			// Your test logic for refresh route
		});

		it("should return 401 if no refresh token provided", async () => {
			// Your test logic for refresh route without a token
		});

		it("should return 403 for an invalid refresh token", async () => {
			// Your test logic for refresh route with an invalid token
		});

		// Add more test cases as needed
	});

	describe("POST /api/auth/logout", () => {
		it("should log out a user and remove refresh token", async () => {
			// Your test logic for logout route
		});

		it("should return 401 if no refresh token provided", async () => {
			// Your test logic for logout route without a token
		});

		// Add more test cases as needed
	});

	afterAll(async () => {
		// Your teardown logic after running tests
	});
});
