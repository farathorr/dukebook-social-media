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

describe("Test Posts", () => {
	const goalsId = [];

	beforeEach(async () => {
		await Post.deleteMany({});
		goalsId.length = 0;
		const goal1 = await api
			.post("/api/posts")
			.set("Authorization", "bearer " + token1)
			.send({ postText: "test post 1", tags: ["test1"] });

		const goal2 = await api
			.post("/api/posts")
			.set("Authorization", "bearer " + token2)
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
				const response = await api.get("/api/posts").set("Authorization", "bearer " + token1);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(2);
			});

			it("Should return all posts with search", async () => {
				const response = await api.get("/api/posts?search=test post 1").set("Authorization", "bearer " + token1);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(2);
			});

			it("Should return 0 post with wrong search", async () => {
				const response = await api.get("/api/posts?search=wrong search").set("Authorization", "bearer " + token1);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(0);
			});

			it("Should return all posts with tags", async () => {
				const response = await api.get("/api/posts?tags=test1").set("Authorization", "bearer " + token1);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(1);
			});

			it("Should return 0 post with wrong tags", async () => {
				const response = await api.get("/api/posts?tags=wrong-tag").set("Authorization", "bearer " + token1);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(0);
			});

			it("Should return all posts with search and tags", async () => {
				const response = await api.get("/api/posts?search=test+post+1&tags=test1").set("Authorization", "bearer " + token1);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(1);
			});

			it("Should return 0 post with wrong search and tags", async () => {
				const response = await api.get("/api/posts?search=wrong+search&tags=wrong-tag").set("Authorization", "bearer " + token1);
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(0);
			});

			describe("When user is logged in and filtering with friends", () => {
				it("Should give 0 posts if user has no friends", async () => {
					const response = await api.get("/api/posts?filter=friends").set("Authorization", "bearer " + token1);
					expect(response.status).toBe(200);
					expect(response.body.length).toBe(0);
				});

				it("Should give all friend posts if user has friends", async () => {
					const response = await api.get("/api/posts?filter=friends").set("Authorization", "bearer " + token2);
					expect(response.status).toBe(200);
					expect(response.body.length).toBe(1);
				});
			});

			describe("When user is logged in and filtering with followed", () => {
				it("Should give 0 posts if user has no followed", async () => {
					const response = await api.get("/api/posts?filter=followed").set("Authorization", "bearer " + token1);
					expect(response.status).toBe(200);
					expect(response.body.length).toBe(0);
				});

				it("Should give all followed posts if user has followed", async () => {
					const response = await api.get("/api/posts?filter=followed").set("Authorization", "bearer " + token2);
					expect(response.status).toBe(200);
					expect(response.body.length).toBe(1);
				});
			});
		});
	});

	describe("GET /api/posts/feed", () => {
		describe("When user is not logged in", () => {
			it("Should return 401", async () => {
				const response = await api.get("/api/posts/feed");
				expect(response.status).toBe(401);
			});
		});

		describe("When user is logged in", () => {
			describe("When user has no followed users", () => {
				it("Should return 200", async () => {
					const response = await api.get("/api/posts/feed").set("Authorization", "bearer " + token1);
					expect(response.status).toBe(200);
					expect(response.body.length).toBe(1);
				});
			});

			describe("When user has followed users", () => {
				it("Should return 200", async () => {
					const response = await api.get("/api/posts/feed").set("Authorization", "bearer " + token2);
					expect(response.status).toBe(200);
					expect(response.body.length).toBe(2);
				});
			});
		});
	});

	describe("GET /api/posts/trending", () => {
		describe("When user is not logged in", () => {
			it("Should return 200", async () => {
				const response = await api.get("/api/posts/trending");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(2);
			});
		});
	});

	describe("GET /api/posts/:id", () => {
		describe("When id is not found", () => {
			it("Should return 404", async () => {
				const response = await api.get("/api/posts/123456789012345678901234");
				expect(response.status).toBe(404);
			});
		});

		describe("When id is found", () => {
			it("Should return 200", async () => {
				const response = await api.get("/api/posts/" + goalsId[0]);
				expect(response.status).toBe(200);
			});
		});
	});

	describe("GET /api/posts/author/:userTag", () => {
		describe("When userTag is not found", () => {
			it("Should return 400", async () => {
				const response = await api.get("/api/posts/author/123456789012345678901234");
				expect(response.status).toBe(400);
			});
		});

		describe("When userTag is found", () => {
			it("Should return 200", async () => {
				const response = await api.get("/api/posts/author/testUser");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(1);
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
					.set("Authorization", "bearer " + token1)
					.send({ postText: "New post" });
				expect(response.status).toBe(201);

				expect(response.body.user.userTag).toBe("testUser");
				expect(response.body.postText).toBe("New post");
				expect(response.header["content-type"]).toMatch(/application\/json/gi);
			});

			it("Should create a new post with text and tags", async () => {
				const response = await api
					.post("/api/posts")
					.set("Authorization", "bearer " + token1)
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
					.set("Authorization", "bearer " + token1)
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
					.set("Authorization", "bearer " + token1)
					.send({ tags: ["test"] });
				expect(response.status).toBe(400);
			});
		});

		describe("When user is logged in and postText is empty", () => {
			it("Should return 400", async () => {
				const response = await api
					.post("/api/posts")
					.set("Authorization", "bearer " + token1)
					.send({ postText: "", tags: ["test"] });
				expect(response.status).toBe(400);
			});
		});

		describe("When user is logged in and tags is not an array", () => {
			it("Should return 400", async () => {
				const response = await api
					.post("/api/posts")
					.set("Authorization", "bearer " + token1)
					.send({ postText: "New post", tags: "test" });
				expect(response.status).toBe(400);
			});
		});

		describe("When user is logged in and images is not an array", () => {
			it("Should return 400", async () => {
				const response = await api
					.post("/api/posts")
					.set("Authorization", "bearer " + token1)
					.send({ postText: "New post", images: "test" });
				expect(response.status).toBe(400);
			});
		});
	});

	describe("PATCH /api/posts/:id", () => {
		describe("When user is not logged in", () => {
			it("Should return 401", async () => {
				const response = await api.patch("/api/posts/" + goalsId[0]).send({ postText: "Updated post" });
				expect(response.status).toBe(401);
			});
		});

		describe("When user is logged in", () => {
			describe("When user is not author", () => {
				it("Should return 403", async () => {
					const response = await api
						.patch("/api/posts/" + goalsId[0])
						.set("Authorization", "bearer " + token2)
						.send({ postText: "Updated post" });
					expect(response.status).toBe(400);
				});
			});

			describe("When user is author", () => {
				it("Should update post", async () => {
					const response = await api
						.patch("/api/posts/" + goalsId[0])
						.set("Authorization", "bearer " + token1)
						.send({ postText: "Updated post" });
					expect(response.status).toBe(200);
					expect(response.body.postText).toBe("Updated post");
				});
			});
		});

		describe("When user is logged in and postText is empty", () => {
			it("Should return 400", async () => {
				const response = await api
					.patch("/api/posts/" + goalsId[0])
					.set("Authorization", "bearer " + token1)
					.send({ postText: "" });
				expect(response.status).toBe(400);
			});
		});

		describe("When user is logged in and tags is not an array", () => {
			it("Should return 400", async () => {
				const response = await api
					.patch("/api/posts/" + goalsId[0])
					.set("Authorization", "bearer " + token1)
					.send({ tags: "test" });
				expect(response.status).toBe(400);
			});
		});

		describe("When user is logged in and images is not an array", () => {
			it("Should return 400", async () => {
				const response = await api
					.patch("/api/posts/" + goalsId[0])
					.set("Authorization", "bearer " + token1)
					.send({ images: "test" });
				expect(response.status).toBe(400);
			});
		});
	});

	describe("DELETE /api/posts/:id", () => {
		describe("When user is not logged in", () => {
			it("Should return 401", async () => {
				const response = await api.delete("/api/posts/" + goalsId[0]);
				expect(response.status).toBe(401);
			});
		});

		describe("When user is logged in", () => {
			describe("When user is not author", () => {
				it("Should return 403", async () => {
					const response = await api.delete("/api/posts/" + goalsId[0]).set("Authorization", "bearer " + token2);
					expect(response.status).toBe(400);
				});
			});

			describe("When user is author", () => {
				it("Should delete post", async () => {
					const response = await api.delete("/api/posts/" + goalsId[0]).set("Authorization", "bearer " + token1);
					expect(response.status).toBe(200);
				});
			});
		});
	});

	describe("PUT /api/posts/:id/like", () => {
		describe("When user is not logged in", () => {
			it("Should return 401", async () => {
				const response = await api.put("/api/posts/" + goalsId[0] + "/like");
				expect(response.status).toBe(401);
			});
		});

		describe("When user is logged in", () => {
			it("Should like post", async () => {
				const response = await api.put("/api/posts/" + goalsId[0] + "/like").set("Authorization", "bearer " + token1);
				expect(response.status).toBe(200);
				expect(response.body.likes.length).toBe(1);
			});

			it("Should not like post twice", async () => {
				await api.put("/api/posts/" + goalsId[0] + "/like").set("Authorization", "bearer " + token1);
				const response = await api.put("/api/posts/" + goalsId[0] + "/like").set("Authorization", "bearer " + token1);
				expect(response.body.likes.length).toBe(0);
			});

			it("Should remove dislikes from post if liked", async () => {
				await api.put("/api/posts/" + goalsId[0] + "/dislike").set("Authorization", "bearer " + token1);
				const response = await api.put("/api/posts/" + goalsId[0] + "/like").set("Authorization", "bearer " + token1);
				expect(response.status).toBe(200);
				expect(response.body.dislikes.length).toBe(0);
				expect(response.body.likes.length).toBe(1);
			});
		});
	});

	describe("PUT /api/posts/:id/dislike", () => {
		describe("When user is not logged in", () => {
			it("Should return 401", async () => {
				const response = await api.put("/api/posts/" + goalsId[0] + "/dislike");
				expect(response.status).toBe(401);
			});
		});

		describe("When user is logged in", () => {
			it("Should dislike post", async () => {
				const response = await api.put("/api/posts/" + goalsId[0] + "/dislike").set("Authorization", "bearer " + token1);
				expect(response.status).toBe(200);
				expect(response.body.dislikes.length).toBe(1);
			});

			it("Should not dislike post twice", async () => {
				await api.put("/api/posts/" + goalsId[0] + "/dislike").set("Authorization", "bearer " + token1);
				const response = await api.put("/api/posts/" + goalsId[0] + "/dislike").set("Authorization", "bearer " + token1);
				expect(response.body.dislikes.length).toBe(0);
			});

			it("Should remove likes from post if disliked", async () => {
				await api.put("/api/posts/" + goalsId[0] + "/like").set("Authorization", "bearer " + token1);
				const response = await api.put("/api/posts/" + goalsId[0] + "/dislike").set("Authorization", "bearer " + token1);
				expect(response.status).toBe(200);
				expect(response.body.likes.length).toBe(0);
				expect(response.body.dislikes.length).toBe(1);
			});
		});
	});

	describe("PATCH /api/posts/:id/reply", () => {
		describe("When user is not logged in", () => {
			it("Should return 401", async () => {
				const response = await api.patch("/api/posts/" + goalsId[0] + "/reply").send({ postText: "Reply" });
				expect(response.status).toBe(401);
			});
		});

		describe("When user is logged in", () => {
			it("Should reply to post", async () => {
				const response = await api
					.patch("/api/posts/" + goalsId[0] + "/reply")
					.set("Authorization", "bearer " + token1)
					.send({ postText: "Reply" });
				expect(response.status).toBe(200);
				expect(response.body.comments.length).toBe(1);
			});
		});

		describe("When user is logged in and postText is empty", () => {
			it("Should return 409", async () => {
				const response = await api
					.patch("/api/posts/" + goalsId[0] + "/reply")
					.set("Authorization", "bearer " + token1)
					.send({ postText: "" });
				expect(response.status).toBe(409);
			});
		});
	});

	describe("GET /api/posts/:id/replies", () => {
		describe("When id is not found", () => {
			it("Should return 404", async () => {
				const response = await api.get("/api/posts/123456789012345678901234/replies");
				expect(response.status).toBe(404);
			});
		});

		describe("When id is found", () => {
			it("Should return 200", async () => {
				const response = await api.get("/api/posts/" + goalsId[0] + "/replies");
				expect(response.status).toBe(200);
			});
		});

		describe("When id is found and replies are empty", () => {
			it("Should return 200", async () => {
				const response = await api.get("/api/posts/" + goalsId[0] + "/replies");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(0);
			});
		});

		describe("When id is found and replies are not empty", () => {
			it("Should return 200", async () => {
				await api
					.patch("/api/posts/" + goalsId[0] + "/reply")
					.set("Authorization", "bearer " + token1)
					.send({ postText: "Reply" });
				const response = await api.get("/api/posts/" + goalsId[0] + "/replies");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(1);
			});
		});
	});

	describe("GET /api/posts/:id/parents", () => {
		describe("When id is not found", () => {
			it("Should return 404", async () => {
				const response = await api.get("/api/posts/123456789012345678901234/parents");
				expect(response.status).toBe(404);
			});
		});

		describe("When id is found", () => {
			it("Should return 200", async () => {
				const response = await api.get("/api/posts/" + goalsId[0] + "/parents");
				expect(response.status).toBe(200);
			});
		});

		describe("When id is found and parents are empty", () => {
			it("Should return 200", async () => {
				const response = await api.get("/api/posts/" + goalsId[0] + "/parents");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(1);
			});
		});

		describe("When id is found and parents are not empty", () => {
			it("Should return 200", async () => {
				const res = await api
					.patch("/api/posts/" + goalsId[0] + "/reply")
					.set("Authorization", "bearer " + token1)
					.send({ postText: "Reply" });
				const response = await api.get("/api/posts/" + res.body.comments.at(0)._id + "/parents");
				expect(response.status).toBe(200);
				expect(response.body.length).toBe(2);
			});
		});
	});
});

afterAll(() => {
	mongoose.connection.close();
});
