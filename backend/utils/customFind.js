function customFind(
	schema,
	{ limit, id, search, isComment, isOriginalPost, followedByUser, friendsWithUser, postByUserId, ...query } = {}
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

		if (followedByUser || friendsWithUser) find[0].$and = [];
		if (followedByUser) find[0].$and.push({ user: { $in: followedByUser.followedIds } });
		if (friendsWithUser) find[0].$and.push({ user: { $in: friendsWithUser.friendList } });

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
