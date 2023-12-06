import { createContext, useEffect, useState } from "react";
import { api } from "../../api";

export const AuthenticationContext = createContext(null);

export default function AuthenticationControls(props) {
	const [authentication, setAuthentication] = useState({
		isAuthenticated: false,
		accessToken: null,
		refreshToken: null,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data, status } = await api.getAuthUserInfo();
				if (status !== 200) return;
				authentication.isAuthenticated = true;

				Object.assign(authentication, { user: data });
				setAuthentication({ ...authentication });
			} catch (err) {}
		};

		fetchData();
	}, []);

	return <AuthenticationContext.Provider value={{ authentication, setAuthentication }} {...props} />;
}
