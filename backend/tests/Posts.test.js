const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const { User, SensitiveData } = require("../models/users");
const RefreshToken = require("../models/refreshToken");
const Post = require("../models/posts");

let token = null;

beforeAll(async () => {
	await SensitiveData.deleteMany({});
	await User.deleteMany({});
	await RefreshToken.deleteMany({});
	await api.post("/api/users").send({ email: "test@mail.com", password: "R3g5T7#gh", userTag: "testUser" });
	const result = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser" });
	token = result.body.accessToken;
});

describe("Test Posts", () => {
	const goalsId = [];

	beforeEach(async () => {
		await Post.deleteMany({});
		goalsId.length = 0;
		const goal1 = await api
			.post("/api/posts")
			.set("Authorization", "bearer " + token)
			.send({ postText: "test post 1", tags: ["test1"] });

		const goal2 = await api
			.post("/api/posts")
			.set("Authorization", "bearer " + token)
			.send({ postText: "test post 2", tags: ["test2"] });

		goalsId.push(goal1.body._id, goal2.body._id);
	});

	describe("GET /api/posts", () => {
		describe("When user is not logged in", () => {
			it("Should return return all posts", async () => {
				const response = await api.get("/api/posts");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(2);
			});

			it("Should return return all posts with search", async () => {
				const response = await api.get("/api/posts?search=test post 1");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(2);
			});

			it("Should return 0 post with wrong search", async () => {
				const response = await api.get("/api/posts?search=wrong search");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(0);
			});

			it("Should return return all posts with tags", async () => {
				const response = await api.get("/api/posts?tags=test1");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(1);
			});

			it("Should return 0 post with wrong tags", async () => {
				const response = await api.get("/api/posts?tags=wrong-tag");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(0);
			});

			it("Should return return all posts with search and tags", async () => {
				const response = await api.get("/api/posts?search=test+post+1&tags=test1");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(1);
			});

			it("Should return 0 post with wrong search and tags", async () => {
				const response = await api.get("/api/posts?search=wrong+search&tags=wrong-tag");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(0);
			});

			it("Should give all post if filtering with friends", async () => {
				const response = await api.get("/api/posts?filter=friends");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(2);
			});
			it("Should give all post if filtering with followed", async () => {
				const response = await api.get("/api/posts?filter=followed");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(2);
			});
		});

		describe("When user is logged in", () => {
			it("Should return all posts", async () => {
				const response = await api.get("/api/posts").set("Authorization", "bearer " + token);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(2);
			});

			it("Should return all posts with search", async () => {
				const response = await api.get("/api/posts?search=test post 1").set("Authorization", "bearer " + token);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(2);
			});

			it("Should return 0 post with wrong search", async () => {
				const response = await api.get("/api/posts?search=wrong search").set("Authorization", "bearer " + token);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(0);
			});

			it("Should return all posts with tags", async () => {
				const response = await api.get("/api/posts?tags=test1").set("Authorization", "bearer " + token);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(1);
			});

			it("Should return 0 post with wrong tags", async () => {
				const response = await api.get("/api/posts?tags=wrong-tag").set("Authorization", "bearer " + token);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(0);
			});

			it("Should return all posts with search and tags", async () => {
				const response = await api.get("/api/posts?search=test+post+1&tags=test1").set("Authorization", "bearer " + token);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(1);
			});

			it("Should return 0 post with wrong search and tags", async () => {
				const response = await api.get("/api/posts?search=wrong+search&tags=wrong-tag").set("Authorization", "bearer " + token);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(0);
			});

			it("Should give 0 posts if filtering with friends", async () => {
				const response = await api.get("/api/posts?filter=friends").set("Authorization", "bearer " + token);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(0);
			});

			it("Should give 0 posts if filtering with followed", async () => {
				const response = await api.get("/api/posts?filter=followed").set("Authorization", "bearer " + token);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(0);
			});
		});
	});

	describe("POST /api/posts", () => {
		describe("When user is not logged in", () => {
			it("Should return 401", async () => {
				const response = await api.post("/api/posts").send({ postText: "New post" });
				expect(response.status).toBe(401);
			});
		});

		describe("When user is logged in", () => {
			it("Should create a new post with text", async () => {
				const response = await api
					.post("/api/posts")
					.set("Authorization", "bearer " + token)
					.send({ postText: "New post" });
				expect(response.status).toBe(201);

				expect(response.body.user.userTag).toBe("testUser");
				expect(response.body.postText).toBe("New post");
				expect(response.header["content-type"]).toMatch(/application\/json/gi);
			});

			it("Should create a new post with text and tags", async () => {
				const response = await api
					.post("/api/posts")
					.set("Authorization", "bearer " + token)
					.send({ postText: "New post", tags: ["test"] });
				expect(response.status).toBe(201);

				expect(response.body.user.userTag).toBe("testUser");
				expect(response.body.postText).toBe("New post");
				expect(response.body.tags).toEqual(["test"]);
				expect(response.header["content-type"]).toMatch(/application\/json/gi);
			});

			it("Should create a new post with text and images", async () => {
				const response = await api
					.post("/api/posts")
					.set("Authorization", "bearer " + token)
					.send({ postText: "New post", images: ["test"] });
				expect(response.status).toBe(201);

				expect(response.body.user.userTag).toBe("testUser");
				expect(response.body.postText).toBe("New post");
				expect(response.body.images).toEqual(["test"]);
				expect(response.header["content-type"]).toMatch(/application\/json/gi);
			});
		});

		describe("When user is logged in and postText is missing", () => {
			it("Should return 400", async () => {
				const response = await api
					.post("/api/posts")
					.set("Authorization", "bearer " + token)
					.send({ tags: ["test"] });
				expect(response.status).toBe(400);
			});
		});

		describe("When user is logged in and postText is empty", () => {
			it("Should return 400", async () => {
				const response = await api
					.post("/api/posts")
					.set("Authorization", "bearer " + token)
					.send({ postText: "", tags: ["test"] });
				expect(response.status).toBe(400);
			});
		});

		describe("When user is logged in and tags is not an array", () => {
			it("Should return 400", async () => {
				const response = await api
					.post("/api/posts")
					.set("Authorization", "bearer " + token)
					.send({ postText: "New post", tags: "test" });
				expect(response.status).toBe(400);
			});
		});

		describe("When user is logged in and images is not an array", () => {
			it("Should return 400", async () => {
				const response = await api
					.post("/api/posts")
					.set("Authorization", "bearer " + token)
					.send({ postText: "New post", images: "test" });
				expect(response.status).toBe(400);
			});
		});
	});
});

afterAll(() => {
	mongoose.connection.close();
});
