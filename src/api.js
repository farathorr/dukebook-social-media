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

export const api = {
	login: async ({ password, userTag, rememberPassword }) => {
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

			return response;
		} catch (err) {
			console.error(err);
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
		}
	},

	createPost: requiresAuth(async ({ postText }) => {
		const response = await axios.post("http://localhost:4000/posts", { postText }, { withCredentials: true });
		return response;
	}),
	getPosts: async () => {
		const response = await axios.get("http://localhost:4000/posts");
		return response;
	},
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
	searchPosts: async (search) => {
		const response = await axios.get(`http://localhost:4000/posts/search/${search}`);
		return response;
	},
	replyToPost: requiresAuth(async ({ postId, postText }) => {
		const response = await axios.patch(`http://localhost:4000/posts/${postId}/reply`, { postText }, { withCredentials: true });
		return response;
	}),
	dislikePost: requiresAuth(async (postId) => {
		const response = await axios.put(`http://localhost:4000/posts/${postId}/dislike`, {}, { withCredentials: true });
		return response;
	}),
	likePost: requiresAuth(async (postId) => {
		const response = await axios.put(`http://localhost:4000/posts/${postId}/like`, {}, { withCredentials: true });
		return response;
	}),
	removePost: requiresAuth(async (postId) => {
		const response = await axios.delete(`http://localhost:4000/posts/${postId}`, { withCredentials: true });
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
		const response = await axios.put(`http://localhost:4000/users/follow/${userTag}`, {}, { withCredentials: true });
		return response;
	}),
	unfollowUser: requiresAuth(async (userTag) => {
		const response = await axios.put(`http://localhost:4000/users/unfollow/${userTag}`, {}, { withCredentials: true });
		return response;
	}),
	addFriend: requiresAuth(async (userTag) => {
		const response = await axios.put(`http://localhost:4000/users/addFriend/${userTag}`, {}, { withCredentials: true });
		return response;
	}),
	removeFriend: requiresAuth(async (userTag) => {
		const response = await axios.put(`http://localhost:4000/users/removeFriend/${userTag}`, {}, { withCredentials: true });
		return response;
	}),

	usePostData: async function (id) {
		const value = useSocket(`post/${id}`);
		const [dislikes, setDislikes] = useState(0);
		const [likes, setLikes] = useState(0);
		const [fetchData, setFetchData] = useState({});

		useEffect(() => {
			if (value) {
				setLikes(value.likes);
				setDislikes(value.dislikes);
			}
		}, [value]);

		useEffect(() => {
			try {
				api.getPostById(id).then(({ data }) => setFetchData(data));
			} catch (err) {
				console.error(err);
			}
		}, []);

		return { ...fetchData, likes, dislikes, setDislikes, setLikes };
	},
};

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

function useSocket(url) {
	const [data, setData] = useState(null);

	useEffect(() => {
		const onData = (result) => setData(result);

		socket.on(url, onData);
		return () => {
			console.log("Clean up");
			socket.off(url, onData);
		};
	}, []);

	return data;
}
