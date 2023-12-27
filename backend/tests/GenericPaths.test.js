const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

describe("Generic path Tests", () => {
	describe("GET /", () => {
		it("should return 200", async () => {
			const response = await api.get("/").expect(200);
			expect(response.body).toHaveProperty("message");
		});
	});

	describe("GET /api", () => {
		it("should return 404", async () => {
			await api.get("/api").expect(404);
		});
	});

	describe("GET /api/unknown", () => {
		it("should return 404", async () => {
			await api.get("/api/unknown").expect(404);
		});
	});

	describe("GET /error", () => {
		it("should return 500", async () => {
			await api.get("/error").expect(500);
		});
	});
});

afterAll(() => {
	mongoose.connection.close();
});
