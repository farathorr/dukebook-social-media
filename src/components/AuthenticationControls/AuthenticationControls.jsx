import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { NotificationContext } from "../NotificationControls/NotificationControls";

const AuthenticationContext = createContext(null);

export default function AuthenticationControls(props) {
	const [addNotification] = useContext(NotificationContext);
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

				const testMessage = (await axios.post("http://localhost:4000/users/getSensitiveData")).data;
				addNotification({ type: "info", message: testMessage.message, title: "Sensitive data", duration: 1000 });
			} catch (err) {}
		};

		fetchData();
		return () => source.cancel();
	}, []);

	return <AuthenticationContext.Provider value={[authentication, setAuthentication]} {...props} />;
}
