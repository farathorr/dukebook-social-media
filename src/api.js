import axios from "axios";

let refreshToken = "";

export const api = {
	users: async () => {
		const response = await axios.get("http://localhost:4000/users");
		return response;
	},
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
			console.error(err);
		}
	},
	sensitiveData: requiresAuth(async () => {
		const response = await axios.post("http://localhost:4000/users/getSensitiveData", {}, { withCredentials: true });
		return response;
	}),
};

function requiresAuth(callback) {
	return async function (...settings) {
		try {
			const response = await callback(...settings);
			return response;
		} catch (err) {
			if (err.response?.status === 403) {
				const response = await api.refreshToken();
				if (response.status === 200) {
					return await callback(settings);
				} else {
					return response;
				}
			} else {
				return err.response;
			}
		}
	};
}
