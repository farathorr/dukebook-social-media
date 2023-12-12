/**
 * @param {Object} schema - Mongoose schema
 * @param {Object} options - Options for the query
 * @param {number} options.limit - Limit the number of results
 * @param {string} options.id - Find a post by id
 * @param {string} options.search - Search for posts by text
 * @param {boolean} options.isComment - Find comments
 * @param {boolean} options.isOriginalPost - Find original posts
 * @param {Object} options.followedByUser - Find posts by users followed by the user
 * @param {Object} options.friendsWithUser - Find posts by users who are friends with the user
 * @param {string} options.postByUserId - Find posts by a specific user
 * @param {string} options.filterLiked - Find posts liked by a specific user
 * @param {string} options.filterDisliked - Find posts disliked by a specific user
 * @param {string} options.hasLiked - Find posts liked by a specific user
 * @param {boolean} options.countLikes - Count the number of likes and dislikes
 * @param {boolean} options.hideLikes - Hide the likes and dislikes arrays
 * @param {string[]} options.tags - Find posts with specific tags
 * @param {boolean} options.removed - Find removed posts
 * @param {boolean} options.sortByTrending - Sort by trending
 * @param {Onject} options.author - Find posts by a specific author
 * @param {Onject} options.getFeedPosts - Find posts by a specific author
 * @returns {Object} - Mongoose query
 */

function customFind(schema, query = {}) {
	const find = [{}];
	let sort = { createdAt: -1, _id: 1 };
	query.limit ??= 100;

	try {
		if (query.id) return schema.findById(query.id);
		if (query.postByUserId) find[0].user = query.postByUserId;

		if (query.search) {
			const wordCount = query.search.split(" ").length;
			find[0].removed = false;

			if (wordCount < 2) find[0].postText = { $regex: query.search, $options: "i" };
			else {
				find[0].$text = { $search: query.search };
				find.push({ score: { $meta: "textScore" } });
				sort.score = { $meta: "textScore" };
			}
		}

		if (query.author) find[0].user = query.author;

		if ("removed" in query) find[0].removed = query.removed;

		if (query.isComment) find[0].nestingLevel = { $gt: 0 };
		else if (query.isOriginalPost) find[0].nestingLevel = 0;

		if (query.followedByUser || query.friendsWithUser) find[0].$and ??= [];
		if (query.followedByUser) find[0].$and.push({ user: { $in: query.followedByUser.followedIds } });
		if (query.friendsWithUser) find[0].$and.push({ user: { $in: query.friendsWithUser.friendList } });

		if (query.filterLiked || query.filterDisliked) find[0].$and ??= [];
		if (query.filterLiked) find[0].$and.push({ likes: { $in: query.filterLiked } });
		if (query.filterDisliked) find[0].$and.push({ dislikes: { $in: query.filterDisliked } });

		if (query.hasLiked) {
			find[1] ??= {};
			schema.schema.eachPath((path) => (find[1][path] ??= true));

			find[1].hasUserLiked = { $in: [query.hasLiked, "$likes"] };
			find[1].hasUserDisliked = { $in: [query.hasLiked, "$dislikes"] };
		}

		if (query.getFeedPosts) {
			find[0].removed = false;
			find[0].$or = [{ user: { $in: query.getFeedPosts.followedIds } }, { user: query.getFeedPosts }];
		}

		if (query.countLikes) {
			find[1] ??= {};
			schema.schema.eachPath((path) => (find[1][path] ??= true));
			find[1].likeCount = { $size: "$likes" };
			find[1].dislikeCount = { $size: "$dislikes" };
		}

		if (query.tags) find[0].tags = { $in: query.tags };

		if (query.hideLikes && find[1]) {
			delete find[1].likes;
			delete find[1].dislikes;
		}

		return schema
			.find(...find)
			.sort(sort)
			.limit(query.limit);
	} catch (err) {
		console.log(err);
		return err;
	}
}

module.exports = customFind;
