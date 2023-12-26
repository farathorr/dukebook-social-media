const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const RefreshToken = require("../models/refreshToken");
const { User, SensitiveData } = require("../models/users");
const { Message, MessageGroup } = require("../models/message");

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

describe("Message API Tests", () => {
	describe("GET /api/messages/groups/:groupId", () => {
		it("should get messages for a group", async () => {
			// Your test logic for getMessages route
		});

		it("should return 400 for missing parameters", async () => {
			// Your test logic for getMessages route with missing parameters
		});

		// Add more test cases as needed
	});

	describe("POST /api/messages/groups/:groupId", () => {
		it("should send a message to a group", async () => {
			// Your test logic for sendMessage route
		});

		it("should return 400 for missing parameters", async () => {
			// Your test logic for sendMessage route with missing parameters
		});

		// Add more test cases as needed
	});

	describe("GET /api/messages/groups", () => {
		it("should get message groups for a user", async () => {
			// Your test logic for getMessageGroups route
		});

		// Add more test cases as needed
	});

	describe("POST /api/messages/groups", () => {
		it("should create a message group", async () => {
			// Your test logic for createMessageGroup route
		});

		it("should return 400 for missing participants", async () => {
			// Your test logic for createMessageGroup route with missing participants
		});

		// Add more test cases as needed
	});

	afterAll(async () => {
		// Your teardown logic after running tests
	});
});
