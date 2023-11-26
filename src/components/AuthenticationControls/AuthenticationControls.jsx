import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthenticationContext = createContext(null);

export default function AuthenticationControls(props) {
	const [authentication, setAuthentication] = useState({
		isAuthenticated: false,
		accessToken: null,
		refreshToken: null,
	});

	useEffect(() => {
		const source = axios.CancelToken.source();
		const fetchData = async () => {
			try {
				const token = localStorage.getItem("refreshToken");
				authentication.refreshToken = token;
				if (!token) return;

				axios.defaults.cancelToken = source.token;
				const { accessToken } = (await axios.post("http://localhost:4001/auth/refresh", { token })).data;
				authentication.accessToken = accessToken;
				if (!accessToken) return;

				axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
				authentication.isAuthenticated = true;
				setAuthentication({ ...authentication });
			} catch (err) {}
		};

		fetchData();
		return () => source.cancel();
	}, []);

	return <AuthenticationContext.Provider value={[authentication, setAuthentication]} {...props} />;
}
