import axios from "axios";
import { useEffect, useState } from "react";
import socketIO from "socket.io-client";

export const socket = socketIO("http://localhost:4000", {
	auth: (test) => {
		test({ token: accessToken });
	},
});

let refreshToken = "";
let accessToken = "";

const apiObject = {
	login: async ({ password, userTag, rememberPassword }, callback) => {
		try {
			const response = await axios.post(
				"http://localhost:4001/auth/login",
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
			const response = await axios.post("http://localhost:4001/auth/refresh", { token: refreshToken }, { withCredentials: true });
			axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
			if (accessToken === "") socket.connect();
			accessToken = response.data.accessToken;
			return response;
		} catch (err) {
			console.log(err);
			return err.response;
		}
	},
	logout: async () => {
		try {
			const response = await axios.post("http://localhost:4001/auth/logout", { token: refreshToken }, { withCredentials: true });
			delete axios.defaults.headers.common["Authorization"];
			accessToken = "";
			refreshToken = "";
			socket.disconnect();
			socket.connect();

			return response;
		} catch (err) {
			console.error(err);
			return err.response;
		}
	},
	updatePost: requiresAuth(async ({ postId, postText }) => {
		const response = await axios.patch(`http://localhost:4000/posts/${postId}`, { postText });
		return response;
	}),

	createPost: requiresAuth(async ({ postText, tags }) => {
		const response = await axios.post("http://localhost:4000/posts", { postText, tags });
		return response;
	}),
	getPosts: requiresAuth(async (query = "") => {
		const response = await axios.get(`http://localhost:4000/posts?${query}`);
		return response;
	}),
	getPostById: async (postId) => {
		const response = await axios.get(`http://localhost:4000/posts/${postId}`);
		return response;
	},
	getPostsByAuthor: async (userTag) => {
		const response = await axios.get(`http://localhost:4000/posts/author/${userTag}`);
		return response;
	},
	getPostReplies: async (postId, nesting) => {
		const response = await axios.get(`http://localhost:4000/posts/${postId}/replies?nesting=${nesting ?? 3}`);
		return response;
	},
	getPostParent: async (postId, nesting) => {
		const response = await axios.get(`http://localhost:4000/posts/${postId}/parents?nesting=${nesting ?? 3}`);
		return response;
	},
	replyToPost: requiresAuth(async ({ postId, postText }) => {
		const response = await axios.patch(`http://localhost:4000/posts/${postId}/reply`, { postText });
		return response;
	}),
	dislikePost: requiresAuth(async (postId) => {
		const response = await axios.put(`http://localhost:4000/posts/${postId}/dislike`, {});
		return response;
	}),
	likePost: requiresAuth(async (postId) => {
		const response = await axios.put(`http://localhost:4000/posts/${postId}/like`, {});
		return response;
	}),
	removePost: requiresAuth(async (postId) => {
		const response = await axios.delete(`http://localhost:4000/posts/${postId}`);
		return response;
	}),

	createUser: async ({ userTag, email, password }) => {
		const response = await axios.post("http://localhost:4000/users", { userTag, email, password });
		return response;
	},
	users: async () => {
		const response = await axios.get("http://localhost:4000/users");
		return response;
	},
	getUserById: async (userId) => {
		const response = await axios.get(`http://localhost:4000/users/${userId}`);
		return response;
	},
	getUserByUserTag: async (userTag) => {
		const response = await axios.get(`http://localhost:4000/users/userTag/${userTag}`);
		return response;
	},
	followUser: requiresAuth(async (userTag) => {
		const response = await axios.put(`http://localhost:4000/users/follow/${userTag}`, {});
		return response;
	}),
	unfollowUser: requiresAuth(async (userTag) => {
		const response = await axios.put(`http://localhost:4000/users/unfollow/${userTag}`, {});
		return response;
	}),
	addFriend: requiresAuth(async (userTag) => {
		const response = await axios.put(`http://localhost:4000/users/addFriend/${userTag}`, {});
		return response;
	}),
	removeFriend: requiresAuth(async (userTag) => {
		const response = await axios.put(`http://localhost:4000/users/removeFriend/${userTag}`, {});
		return response;
	}),
	getFriends: async (userTag) => {
		const response = await axios.get(`http://localhost:4000/users/friends/${userTag}`);
		return response;
	},

	getMessageGroups: requiresAuth(async () => {
		const response = await axios.get("http://localhost:4000/messages/groups");
		return response;
	}),

	getMessages: requiresAuth(async (groupId) => {
		const response = await axios.get(`http://localhost:4000/messages?groupId=${groupId}`);
		return response;
	}),
	sendMessage: requiresAuth(async ({ groupId, text }) => {
		const response = await axios.post(`http://localhost:4000/messages`, { groupId, text });
		return response;
	}),

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
		console.log(callback.constructor.name);

		if (callback.constructor.name === "AsyncFunction") {
			return async (...settings) => {
				try {
					return await callback(...settings);
				} catch (err) {
					console.log(err);
					return err.response;
				}
			};
		} else {
			return (...settings) => {
				try {
					return callback(...settings);
				} catch (err) {
					console.log(err);
					return err.response;
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
			if (err.response?.status === 403) {
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
