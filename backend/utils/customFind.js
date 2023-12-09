function customFind(
	schema,
	{
		limit,
		id,
		search,
		isComment,
		isOriginalPost,
		followedByUser,
		friendsWithUser,
		postByUserId,
		filterLiked,
		filterDisliked,
		hasLiked,
		countLikes,
		hideLikes,
		tags,
		...query
	} = {}
) {
	const find = [{}];
	const sort = { createdAt: -1, _id: 1 };
	limit ??= 100;

	try {
		if (id) return schema.findById(id);
		if (postByUserId) find[0].user = postByUserId;

		if (search) {
			const wordCount = search.split(" ").length;
			find[0].removed = false;

			if (wordCount < 2) find[0].postText = { $regex: search, $options: "i" };
			else {
				find[0].$text = { $search: search };
				find.push({ score: { $meta: "textScore" } });
				sort.score = { $meta: "textScore" };
			}
		}

		if (isComment) find[0].nestingLevel = { $gt: 0 };
		else if (isOriginalPost) find[0].nestingLevel = 0;

		if (followedByUser || friendsWithUser) find[0].$and ??= [];
		if (followedByUser) find[0].$and.push({ user: { $in: followedByUser.followedIds } });
		if (friendsWithUser) find[0].$and.push({ user: { $in: friendsWithUser.friendList } });

		if (filterLiked || filterDisliked) find[0].$and ??= [];
		if (filterLiked) find[0].$and.push({ likes: { $in: filterLiked } });
		if (filterDisliked) find[0].$and.push({ dislikes: { $in: filterDisliked } });

		if (hasLiked) {
			find[1] ??= {};
			schema.schema.eachPath((path) => (find[1][path] ??= true));

			find[1].hasUserLiked = { $in: [hasLiked, "$likes"] };
			find[1].hasUserDisliked = { $in: [hasLiked, "$dislikes"] };
		}

		if (countLikes) {
			find[1] ??= {};
			schema.schema.eachPath((path) => (find[1][path] ??= true));
			find[1].likeCount = { $size: "$likes" };
			find[1].dislikeCount = { $size: "$dislikes" };
		}

		if (tags) find[0].tags = { $in: tags };

		if (hideLikes && find[1]) {
			delete find[1].likes;
			delete find[1].dislikes;
		}

		return schema
			.find(...find)
			.sort(sort)
			.limit(limit);
	} catch (err) {
		console.log(err);
		return err;
	}
}

module.exports = customFind;
