const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const { User, SensitiveData } = require("../models/users");
const RefreshToken = require("../models/refreshToken");
const Post = require("../models/posts");

let token1 = null;
let token2 = null;

beforeAll(async () => {
	await SensitiveData.deleteMany({});
	await User.deleteMany({});
	await RefreshToken.deleteMany({});
	await api.post("/api/users").send({ email: "test@mail.com", password: "R3g5T7#gh", userTag: "testUser" });
	await api.post("/api/users").send({ email: "test2@mail.com", password: "123456789!", userTag: "testUser2" });

	const result1 = await api.post("/api/auth/login").send({ password: "R3g5T7#gh", userTag: "testUser" });
	const result2 = await api.post("/api/auth/login").send({ password: "123456789!", userTag: "testUser2" });
	token1 = result1.body.accessToken;
	token2 = result2.body.accessToken;

	await api.put("/api/users/follow/testUser").set("Authorization", "bearer " + token2);
	await api.put("/api/users/addFriend/testUser").set("Authorization", "bearer " + token2);
});

describe("Test users", () => {
	const userId = [];

	beforeEach(async () => {
		if (userId.length) {
			await User.deleteOne({ _id: userId[0] });
			await SensitiveData.deleteOne({ email: "test3@mail.com" });
		}
		userId.length = 0;
		const user = await api.post("/api/users").send({ email: "test3@mail.com", password: "R3g5T7#gh", userTag: "testUser3" });
		userId.push(user.body._id);
	});

	describe("GET /api/users", () => {
		it("Should return all users", async () => {
			const result = await api.get("/api/users");
			expect(result.body).toHaveLength(3);
		});
	});

	describe("GET /api/users/:id", () => {
		it("Should return user with id", async () => {
			const result = await api.get("/api/users/" + userId[0]);
			expect(result.status).toBe(200);
			expect(result.body.userTag).toBe("testUser3");
		});

		it("Should return 404 with invalid id", async () => {
			const result = await api.get("/api/users/123");
			expect(result.status).toBe(404);
		});
	});

	describe("GET /api/users/userTag/:userTag", () => {
		it("Should return user with userTag", async () => {
			const result = await api.get("/api/users/userTag/testUser3").set("Authorization", "bearer " + token1);
			expect(result.status).toBe(200);
			expect(result.body.userTag).toBe("testUser3");
		});

		it("Should return 404 with invalid userTag", async () => {
			const result = await api.get("/api/users/userTag/123").set("Authorization", "bearer " + token1);
			expect(result.status).toBe(404);
		});
	});

	describe("GET /api/users/followers/:userTag", () => {
		it("Should return followers of user with userTag", async () => {
			const result = await api.get("/api/users/followers/testUser").set("Authorization", "bearer " + token1);
			expect(result.status).toBe(200);
			expect(result.body).toHaveLength(1);
		});

		it("Should return 404 with invalid userTag", async () => {
			const result = await api.get("/api/users/followers/123").set("Authorization", "bearer " + token1);
			expect(result.status).toBe(404);
		});
	});

	describe("GET /api/users/following/:userTag", () => {
		it("Should return following of user with userTag", async () => {
			const result = await api.get("/api/users/following/testUser2").set("Authorization", "bearer " + token1);
			expect(result.status).toBe(200);
			expect(result.body).toHaveLength(1);
		});

		it("Should return 404 with invalid userTag", async () => {
			const result = await api.get("/api/users/following/123").set("Authorization", "bearer " + token1);
			expect(result.status).toBe(404);
		});
	});

	describe("PUT /api/users/follow/:userTag", () => {
		it("Should follow user with userTag", async () => {
			const result = await api.put("/api/users/follow/testUser3").set("Authorization", "bearer " + token1);
			expect(result.status).toBe(200);
			expect(result.body.followerIds).toHaveLength(1);
		});

		it("Should not allow user to follow themselves", async () => {
			const result = await api.put("/api/users/follow/testUser").set("Authorization", "bearer " + token1);
			expect(result.status).toBe(404);
		});

		it("Should not allow double follow", async () => {
			const result = await api.put("/api/users/follow/testUser").set("Authorization", "bearer " + token2);
			expect(result.status).toBe(404);
		});

		it("Should return 404 with invalid userTag", async () => {
			const result = await api.put("/api/users/follow/123").set("Authorization", "bearer " + token1);
			expect(result.status).toBe(404);
		});
	});

	describe("PUT /api/users/unfollow/:userTag", () => {
		it("Should unfollow user with userTag", async () => {
			const result = await api.put("/api/users/unfollow/testUser").set("Authorization", "bearer " + token2);
			expect(result.status).toBe(200);
			expect(result.body.followerIds).toHaveLength(0);
		});

		it("Should not allow user to unfollow themselves", async () => {
			const result = await api.put("/api/users/unfollow/testUser").set("Authorization", "bearer " + token1);
			expect(result.status).toBe(404);
		});

		it("Should not allow user to unfollow users that are not being followed", async () => {
			const result = await api.put("/api/users/unfollow/testUser").set("Authorization", "bearer " + token2);
			expect(result.status).toBe(404);
		});

		it("Should return 404 with invalid userTag", async () => {
			const result = await api.put("/api/users/unfollow/123").set("Authorization", "bearer " + token1);
			expect(result.status).toBe(404);
		});
	});

	describe("GET /api/users/friends/:userTag", () => {
		it("Should return friends of user with userTag", async () => {
			const result = await api.get("/api/users/friends/testUser2");
			expect(result.status).toBe(200);
			expect(result.body).toHaveLength(1);
		});

		it("Should return 404 with invalid userTag", async () => {
			const result = await api.get("/api/users/friends/123");
			expect(result.status).toBe(404);
		});
	});

	describe("PUT /api/users/addFriend/:userTag", () => {
		describe("If user is not logged in", () => {
			it("Should return 401", async () => {
				const result = await api.put("/api/users/addFriend/testUser3");
				expect(result.status).toBe(401);
			});
		});

		describe("If user is logged in", () => {
			it("Should add friend with userTag", async () => {
				const result = await api.put("/api/users/addFriend/testUser3").set("Authorization", "bearer " + token1);
				expect(result.status).toBe(200);
				const friendResponse = await api.get("/api/users/friends/testUser");
				expect(friendResponse.body).toHaveLength(1);
			});

			it("Should not allow user to add themselves as friend", async () => {
				const result = await api.put("/api/users/addFriend/testUser").set("Authorization", "bearer " + token1);
				expect(result.status).toBe(404);
			});

			it("Should not allow double add friend", async () => {
				const result = await api.put("/api/users/addFriend/testUser").set("Authorization", "bearer " + token2);
				expect(result.status).toBe(404);
			});

			it("Should return 404 with invalid userTag", async () => {
				const result = await api.put("/api/users/addFriend/123").set("Authorization", "bearer " + token1);
				expect(result.status).toBe(404);
			});
		});
	});

	describe("PUT /api/users/removeFriend/:userTag", () => {
		describe("If user is not logged in", () => {
			it("Should return 401", async () => {
				const result = await api.put("/api/users/removeFriend/testUser");
				expect(result.status).toBe(401);
			});
		});

		describe("If user is logged in", () => {
			it("Should remove friend with userTag", async () => {
				const result = await api.put("/api/users/removeFriend/testUser").set("Authorization", "bearer " + token2);
				expect(result.status).toBe(200);
				const friendResponse = await api.get("/api/users/friends/testUser");
				expect(friendResponse.body).toHaveLength(0);
			});

			it("Should not allow user to remove themselves as friend", async () => {
				const result = await api.put("/api/users/removeFriend/testUser").set("Authorization", "bearer " + token1);
				expect(result.status).toBe(404);
			});

			it("Should not allow user to remove users that are not friends", async () => {
				const result = await api.put("/api/users/removeFriend/testUser").set("Authorization", "bearer " + token2);
				expect(result.status).toBe(404);
			});

			it("Should return 404 with invalid userTag", async () => {
				const result = await api.put("/api/users/removeFriend/123").set("Authorization", "bearer " + token1);
				expect(result.status).toBe(404);
			});
		});
	});

	describe("DELETE /api/users", () => {
		describe("If user is not logged in", () => {
			it("Should return 401", async () => {
				const result = await api.delete("/api/users");
				expect(result.status).toBe(401);
			});
		});

		describe("If user is logged in", () => {
			it("Should delete user", async () => {
				const result = await api.delete("/api/users").set("Authorization", "bearer " + token1);
				expect(result.status).toBe(200);
				const userResponse = await api.get("/api/users/userTag/testUser");
				expect(userResponse.status).toBe(404);
			});
		});
	});

	describe("POST /api/users", () => {
		it("Should create user", async () => {
			const result = await api.post("/api/users").send({ email: "newEmail", password: "R3g5T7#gh", userTag: "testUser4" });
			expect(result.status).toBe(201);
			expect(result.body.userTag).toBe("testUser4");
		});

		it("Should not allow duplicate userTag", async () => {
			const result = await api.post("/api/users").send({ email: "newEmail", password: "R3g5T7#gh", userTag: "testUser3" });
			expect(result.status).toBe(409);
		});

		it("Should not allow duplicate email", async () => {
			const result = await api.post("/api/users").send({ email: "newEmail", password: "R3g5T7#gh", userTag: "testUser5" });
			expect(result.status).toBe(409);
		});

		it("Should not allow missing userTag", async () => {
			const result = await api.post("/api/users").send({ email: "newEmail", password: "R3g5T7#gh" });
			expect(result.status).toBe(400);
		});

		it("Should not allow missing email", async () => {
			const result = await api.post("/api/users").send({ userTag: "testUser5", password: "R3g5T7#gh" });
			expect(result.status).toBe(400);
		});

		it("Should not allow missing password", async () => {
			const result = await api.post("/api/users").send({ email: "newEmail", userTag: "testUser5" });
			expect(result.status).toBe(400);
		});
	});
});

afterAll(() => {
	mongoose.connection.close();
});
