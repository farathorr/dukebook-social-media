import axios from "axios";
import { useEffect, useState } from "react";
import socketIO from "socket.io-client";

export const socket = socketIO("https://social-media-group9.onrender.com", {
	auth: (token) => {
		token({ token: accessToken });
	},
});

let refreshPromise = null;
let refreshToken = null;
let accessToken = null;

const apiObject = {
	login: async ({ password, userTag, rememberPassword }, callback) => {
		try {
			const response = await axios.post(
				"https://social-media-group9.onrender.com/api/auth/login",
				{ password, userTag, rememberPassword },
				{ withCredentials: true }
			);

			axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
			refreshToken = response.data.refreshToken;
			accessToken = response.data.accessToken;
			socket.disconnect();
			socket.connect();

			if (callback) return callback(response) ?? response;
			return response;
		} catch (err) {
			console.error(err);
			return err.response;
		}
	},
	refreshToken: async () => {
		try {
			refreshPromise ??= axios.post(
				"https://social-media-group9.onrender.com/api/auth/refresh",
				{ token: refreshToken },
				{ withCredentials: true }
			);
			const response = await refreshPromise;

			axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
			if (!accessToken) socket.connect();
			accessToken = response.data.accessToken;
			setTimeout(() => (refreshPromise = null), 1000);
			return response;
		} catch (err) {
			console.log(err);
			return err.response;
		}
	},
	logout: async () => {
		try {
			const response = await axios.post(
				"https://social-media-group9.onrender.com/api/auth/logout",
				{ token: refreshToken },
				{ withCredentials: true }
			);
			delete axios.defaults.headers.common["Authorization"];
			accessToken = refreshToken = null;
			socket.disconnect();
			socket.connect();

			return response;
		} catch (err) {
			console.error(err);
			return err.response;
		}
	},
	updatePost: requiresAuth(async ({ postId, postText, tags, images }) => {
		const response = await axios.patch(`https://social-media-group9.onrender.com/api/posts/${postId}`, { postText, tags, images });
		return response;
	}),

	createPost: requiresAuth(async ({ postText, tags, images }) => {
		const response = await axios.post("https://social-media-group9.onrender.com/api/posts", { postText, tags, images });
		return response;
	}),
	getPosts: requiresAuth(async (query = "") => {
		const response = await axios.get(`https://social-media-group9.onrender.com/api/posts?${query}`);
		return response;
	}),
	getUserFeedPosts: requiresAuth(async () => {
		const response = await axios.get(`https://social-media-group9.onrender.com/api/posts/feed?`);
		return response;
	}),
	getPostById: async (postId) => {
		const response = await axios.get(`https://social-media-group9.onrender.com/api/posts/${postId}`);
		return response;
	},
	getPostsByAuthor: async (userTag) => {
		const response = await axios.get(`https://social-media-group9.onrender.com/api/posts/author/${userTag}`);
		return response;
	},
	getPostReplies: async (postId, nesting) => {
		const response = await axios.get(`https://social-media-group9.onrender.com/api/posts/${postId}/replies?nesting=${nesting ?? 3}`);
		return response;
	},
	getPostParent: async (postId, nesting) => {
		const response = await axios.get(`https://social-media-group9.onrender.com/api/posts/${postId}/parents?nesting=${nesting ?? 3}`);
		return response;
	},
	replyToPost: requiresAuth(async ({ postId, postText, tags, images }) => {
		const response = await axios.patch(`https://social-media-group9.onrender.com/api/posts/${postId}/reply`, { postText, tags, images });
		return response;
	}),
	dislikePost: requiresAuth(async (postId) => {
		const response = await axios.put(`https://social-media-group9.onrender.com/api/posts/${postId}/dislike`, {});
		return response;
	}),
	likePost: requiresAuth(async (postId) => {
		const response = await axios.put(`https://social-media-group9.onrender.com/api/posts/${postId}/like`, {});
		return response;
	}),
	removePost: requiresAuth(async (postId) => {
		const response = await axios.delete(`https://social-media-group9.onrender.com/api/posts/${postId}`);
		return response;
	}),

	createUser: async ({ userTag, email, password }) => {
		const response = await axios.post("https://social-media-group9.onrender.com/api/users", { userTag, email, password });
		return response;
	},
	users: async () => {
		const response = await axios.get("https://social-media-group9.onrender.com/api/users");
		return response;
	},
	getUserById: async (userId) => {
		const response = await axios.get(`https://social-media-group9.onrender.com/api/users/${userId}`);
		return response;
	},
	getUserByUserTag: async (userTag) => {
		const response = await axios.get(`https://social-media-group9.onrender.com/api/users/userTag/${userTag}`);
		return response;
	},
	followUser: requiresAuth(async (userTag) => {
		const response = await axios.put(`https://social-media-group9.onrender.com/api/users/follow/${userTag}`, {});
		return response;
	}),
	unfollowUser: requiresAuth(async (userTag) => {
		const response = await axios.put(`https://social-media-group9.onrender.com/api/users/unfollow/${userTag}`, {});
		return response;
	}),
	addFriend: requiresAuth(async (userTag) => {
		const response = await axios.put(`https://social-media-group9.onrender.com/api/users/addFriend/${userTag}`, {});
		return response;
	}),
	removeFriend: requiresAuth(async (userTag) => {
		const response = await axios.put(`https://social-media-group9.onrender.com/api/users/removeFriend/${userTag}`, {});
		return response;
	}),
	getFriends: async (userTag) => {
		const response = await axios.get(`https://social-media-group9.onrender.com/api/users/friends/${userTag}`);
		return response;
	},

	getMessageGroups: requiresAuth(async () => {
		const response = await axios.get("https://social-media-group9.onrender.com/api/messages/groups");
		return response;
	}),

	getMessages: requiresAuth(async (groupId) => {
		const response = await axios.get(`https://social-media-group9.onrender.com/api/messages/group/${groupId}`);
		return response;
	}),
	sendMessage: requiresAuth(async ({ groupId, text }) => {
		const response = await axios.post(`https://social-media-group9.onrender.com/api/messages/group/${groupId}`, { text });
		return response;
	}),

	getAuthUserInfo: requiresAuth(async () => {
		const response = await axios.get("https://social-media-group9.onrender.com/api/profile");
		return response;
	}),
	updateAuthUser: requiresAuth(async ({ username, userTag, email, password, profilePicture, bio }) => {
		const response = await axios.patch("https://social-media-group9.onrender.com/api/profile", {
			username,
			userTag,
			email,
			password,
			profilePicture,
			bio,
		});
		return response;
	}),

	uploadImage: requiresAuth(async (image) => {
		const response = await axios.post("https://social-media-group9.onrender.com/api/image", { image });
		return response;
	}),
	deleteImage: requiresAuth(async (deleteHash) => {
		const response = await axios.delete(`https://social-media-group9.onrender.com/api/image/${deleteHash}`);
		return response;
	}),

	getTrendingPosts: async () => {
		const response = await axios.get("https://social-media-group9.onrender.com/api/posts/trending");
		return response;
	},

	usePostStats: (id, props) => {
		const [value] = useSocket(`post/${id}`);
		const [dislikes, setDislikes] = useState(props?.dislikes ?? 0);
		const [likes, setLikes] = useState(props?.likes ?? 0);
		const [comments, setComments] = useState(props?.comments ?? 0);

		useEffect(() => {
			if (!value) return;

			setLikes((v) => value.likes ?? v);
			setDislikes((v) => value.dislikes ?? v);
			setComments((v) => value.comments ?? v);
		}, [value]);

		return { ...value, likes, dislikes, comments, setDislikes, setLikes, setComments };
	},
	useMessage: (baseId) => {
		const [message, setUrl] = useSocket(`message/${baseId}`);
		const updateGroup = (id) => setUrl(`message/${id}`);

		return [message, updateGroup];
	},
};

export const api = new Proxy(apiObject, {
	get: (target, prop) => {
		const callback = target[prop];

		if (callback.constructor.name === "AsyncFunction") {
			return async (...settings) => {
				try {
					return await callback(...settings);
				} catch (err) {
					return err.response || err || { error: "Unknown error" };
				}
			};
		} else {
			return (...settings) => {
				try {
					return callback(...settings);
				} catch (err) {
					return err.response || err || { error: "Unknown error" };
				}
			};
		}
	},
});

function requiresAuth(callback) {
	return async function (...settings) {
		try {
			const response = await callback(...settings);
			return response;
		} catch (err) {
			if (err.response?.status === 403 || !accessToken) {
				const response = await api.refreshToken();
				if (response?.status === 200) {
					return await callback(...settings);
				} else {
					return response;
				}
			} else {
				return err.response;
			}
		}
	};
}

function useSocket(baseUrl) {
	const [data, setData] = useState(null);
	const [url, setUrl] = useState(baseUrl);

	useEffect(() => {
		const onData = (result) => setData(result);
		socket.on(url, onData);

		return () => socket.off(url, onData);
	}, [url]);

	return [data, setUrl];
}
