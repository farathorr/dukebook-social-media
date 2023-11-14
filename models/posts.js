const posts = [
	{
		id: 1,
		parentId: null,
		tags: ["node", "express", "javascript"],
		body: "This is post 1",
		author: "John Doe",
		likes: 10,
		dislikes: 1,
		replies: [2, 3],
	},
	{
		id: 2,
		parentId: 1,
		tags: ["node", "express", "javascript"],
		body: "This is post 2",
		author: "Katie Smith",
		likes: 12,
		dislikes: 2,
		replies: [4],
	},
	{
		id: 3,
		parentId: 1,
		tags: ["node", "express", "javascript"],
		body: "This is post 3",
		author: "Tom Jones",
		likes: 9,
		dislikes: 3,
		replies: [],
	},
	{
		id: 4,
		parentId: 2,
		tags: [],
		body: "This is post 4",
		author: "Vicky Pollard",
		likes: 0,
		dislikes: 0,
		replies: [],
	},
];

module.exports = posts;
