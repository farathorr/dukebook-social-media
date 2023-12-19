const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Goal = require("../models/goalModel");

let token = null;

beforeAll(async () => {
	await User.deleteMany({});
	const result = await api.post("/api/users").send({ email: "mattiv@matti.fi", password: "R3g5T7#gh", name: "Mattiv" });
	token = result.body.token;
});

describe("Test goals", () => {
	const goalsId = [];

	beforeEach(async () => {
		await Goal.deleteMany({});
		goalsId.length = 0;
		const goal1 = await api
			.post("/api/goals")
			.set("Authorization", "bearer " + token)
			.send({ text: "testgoal1" });

		const goal2 = await api
			.post("/api/goals")
			.set("Authorization", "bearer " + token)
			.send({ text: "testgoal2" });

		goalsId.push(goal1.body._id, goal2.body._id);
	});

	it("Should get all the goals", async () => {
		const response = await api.get("/api/goals").set("Authorization", "bearer " + token);
		expect(response.status).toBe(200);

		expect(response.header["content-type"]).toMatch(/application\/json/gi);
		expect(response.body.length).toBe(2);
	});

	it("Should delete one of the goals", async () => {
		const response = await api.delete("/api/goals/" + goalsId[0]).set("Authorization", "bearer " + token);
		expect(response.status).toBe(200);

		expect(response.header["content-type"]).toMatch(/application\/json/gi);
		expect(response.body._id).toBe(goalsId[0]);
		await api
			.get("/api/goals/" + goalsId[0])
			.set("Authorization", "bearer " + token)
			.expect(404);
	});

	it("Should update a specific goal", async () => {
		const response = await api
			.put("/api/goals/" + goalsId[0])
			.set("Authorization", "bearer " + token)
			.send({ text: "testgoal1 updated" });
		expect(response.status).toBe(200);

		expect(response.header["content-type"]).toMatch(/application\/json/gi);
		expect(response.body._id).toBe(goalsId[0]);
		expect(response.body.text).toBe("testgoal1 updated");
		const res = await api.get("/api/goals/" + goalsId[0]).set("Authorization", "bearer " + token);

		expect(res.body.text).toBe("testgoal1 updated");
	});

	it("Should add a new goal", async () => {
		const response = await api
			.post("/api/goals")
			.set("Authorization", "bearer " + token)
			.send({ text: "testgoal3" });
		expect(response.status).toBe(200);

		expect(response.header["content-type"]).toMatch(/application\/json/gi);

		expect(response.body._id).toBeDefined();
		expect(response.body.text).toBe("testgoal3");

		await api
			.get("/api/goals/" + response.body._id)
			.set("Authorization", "bearer " + token)
			.expect(200);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
