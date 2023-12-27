const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const RefreshToken = require("../models/refreshToken");
const { User, SensitiveData } = require("../models/users");
const { Message, MessageGroup } = require("../models/message");

let token1 = null;
let token2 = null;
const userIds = [];

beforeAll(async () => {
	await SensitiveData.deleteMany({});
	await User.deleteMany({});
	await RefreshToken.deleteMany({});
	await Message.deleteMany({});
	await MessageGroup.deleteMany({});
	await api.post("/api/users").send({ email: "test@mail.com", password: "R3g5T7#gh", userTag: "testUser" });
	await api.post("/api/users").send({ email: "test2@mail.com", password: "R3g5T7#gh", userTag: "testUser2" });

	const users = await User.find({});
	users.forEach((user) => userIds.push(user._id));

	const result1 = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser" });
	const result2 = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser2" });
	await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser2" });
	token1 = result1.body.accessToken;
	token2 = result2.body.accessToken;
});

describe("Messages profile", () => {
	describe("GET /api/messages/groups", () => {
		it("should return 401 with no authentication", async () => {
			await api.get("/api/messages/groups").expect(401);
		});

		it("should return 200 with no groups", async () => {
			const response = await api.get("/api/messages/groups").set("Authorization", `bearer ${token1}`).expect(200);
			expect(response.body).toHaveLength(0);
		});

		it("should return 200 with 1 group", async () => {
			await api.post("/api/messages/groups").set("Authorization", `bearer ${token1}`).send({ participants: userIds }).expect(201);
			const response = await api.get("/api/messages/groups").set("Authorization", `bearer ${token1}`).expect(200);
			expect(response.body).toHaveLength(1);
		});
	});

	describe("POST /api/messages/groups", () => {
		it("should return 401 with no authentication", async () => {
			await api.post("/api/messages/groups").expect(401);
		});

		it("should return 400 with no participants", async () => {
			await api.post("/api/messages/groups").set("Authorization", `bearer ${token1}`).expect(400);
		});

		it("should return 400 with no participants", async () => {
			await api.post("/api/messages/groups").set("Authorization", `bearer ${token1}`).send({ participants: [] }).expect(400);
		});

		it("should return 400 with wrong participation id", async () => {
			await api
				.post("/api/messages/groups")
				.set("Authorization", `bearer ${token1}`)
				.send({ participants: ["60a3e0d2b6b9b1a0c0b2b5d1"] })
				.expect(400);
		});

		it("should return 201 with 2 participants", async () => {
			const response = await api
				.post("/api/messages/groups")
				.set("Authorization", `bearer ${token1}`)
				.send({ participants: userIds })
				.expect(201);
			expect(response.body).toHaveProperty("participants");
			expect(response.body.participants).toHaveLength(2);
		});
	});

	describe("GET /api/messages/group/:groupId", () => {
		it("should return 401 with no authentication", async () => {
			await api.get("/api/messages/group/60a3e0d2b6b9b1a0c0b2b5d1").expect(401);
		});

		it("should return 400 with wrong group id", async () => {
			await api.get("/api/messages/group/60a3e0d2b6b9b1a0c0b2b5d1").set("Authorization", `bearer ${token1}`).expect(400);
		});

		it("should return 406 with no permission", async () => {
			const response = await api
				.post("/api/messages/groups")
				.set("Authorization", `bearer ${token1}`)
				.send({ participants: [userIds[0]] })
				.expect(201);

			await api.get(`/api/messages/group/${response.body._id}`).set("Authorization", `bearer ${token2}`).expect(406);
		});

		it("should return 500 with the wrong group id format", async () => {
			await api.get("/api/messages/group/123").set("Authorization", `bearer ${token1}`).expect(500);
		});

		it("should return 200 with 0 message", async () => {
			const groups = await MessageGroup.findOne({});
			const response = await api.get(`/api/messages/group/${groups._id}`).set("Authorization", `bearer ${token1}`).expect(200);
			expect(response.body).toHaveLength(0);
		});

		it("should return 200 with 2 message", async () => {
			const groups = await MessageGroup.findOne({});
			await api.post(`/api/messages/group/${groups._id}`).set("Authorization", `bearer ${token1}`).send({ text: "test" }).expect(201);
			await api.post(`/api/messages/group/${groups._id}`).set("Authorization", `bearer ${token1}`).send({ text: "test2" }).expect(201);
			const response = await api.get(`/api/messages/group/${groups._id}`).set("Authorization", `bearer ${token1}`).expect(200);
			expect(response.body).toHaveLength(2);
		});
	});

	describe("POST /api/messages/group/:groupId", () => {
		it("should return 401 with no authentication", async () => {
			await api.post("/api/messages/group/60a3e0d2b6b9b1a0c0b2b5d1").expect(401);
		});

		it("should return 400 with wrong group id", async () => {
			await api.post("/api/messages/group/60a3e0d2b6b9b1a0c0b2b5d1").set("Authorization", `bearer ${token1}`).expect(400);
		});

		it("should return 400 with no text", async () => {
			const groups = await MessageGroup.findOne({});
			await api.post(`/api/messages/group/${groups._id}`).set("Authorization", `bearer ${token1}`).expect(400);
		});

		it("should return 406 with no permission", async () => {
			const response = await api
				.post("/api/messages/groups")
				.set("Authorization", `bearer ${token1}`)
				.send({ participants: [userIds[0]] })
				.expect(201);

			await api
				.post(`/api/messages/group/${response.body._id}`)
				.set("Authorization", `bearer ${token2}`)
				.send({ text: "test" })
				.expect(406);
		});

		it("should return 500 with the wrong group id format", async () => {
			await api.post("/api/messages/group/--").set("Authorization", `bearer ${token1}`).send({ text: "text" }).expect(500);
		});

		it("should return 201 with 1 message", async () => {
			const groups = await MessageGroup.findOne({});
			const response = await api
				.post(`/api/messages/group/${groups._id}`)
				.set("Authorization", `bearer ${token1}`)
				.send({ text: "test" })
				.expect(201);
			expect(response.body).toHaveProperty("text");
			expect(response.body.text).toBe("test");
		});
	});
});

afterAll(() => {
	mongoose.connection.close();
});
