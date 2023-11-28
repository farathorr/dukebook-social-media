import axios from "axios";

let refreshToken = "";

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

			return response;
		} catch (err) {
			console.error(err);
		}
	},
	refreshToken: async () => {
		try {
			const response = await axios.post("http://localhost:4001/auth/refresh", { token: refreshToken }, { withCredentials: true });
			axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
			return response;
		} catch (err) {
			return err.response;
		}
	},
	logout: async () => {
		try {
			const response = await axios.post("http://localhost:4001/auth/logout", { token: refreshToken }, { withCredentials: true });
			return response;
		} catch (err) {
			console.error(err);
		}
	},
	sensitiveData: requiresAuth(async () => {
		const response = await axios.post("http://localhost:4000/users/getSensitiveData", {}, { withCredentials: true });
		return response;
	}),

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

	users: async () => {
		const response = await axios.get("http://localhost:4000/users");
		return response;
	},
	getUserByUserTag: async (userTag) => {
		const response = await axios.get(`http://localhost:4000/users/userTag/${userTag}`);
		return response;
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
