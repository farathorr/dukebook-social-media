const users = [
	{
		id: 1,
		name: "John Doe",
		username: "johndoe",
		likedPosts: [1],
		dislikedPosts: [2],
		sharedPosts: [3],
		followerIds: [2],
		followingIds: [],
	},
	{
		id: 2,
		name: "vicky pollard",
		username: "vickypollard",
		likedPosts: [3],
		dislikedPosts: [4],
		sharedPosts: [3],
		followerIds: [1],
		followingIds: [2],
	},
];

module.exports = users;
