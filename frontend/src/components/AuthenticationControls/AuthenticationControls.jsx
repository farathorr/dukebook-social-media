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
				const { data } = await api.refreshToken();
				if (!data?.accessToken) return;
				authentication.isAuthenticated = true;

				Object.assign(authentication, data);
				setAuthentication({ ...authentication });
			} catch (err) {}
		};

		fetchData();
	}, []);

	return <AuthenticationContext.Provider value={[authentication, setAuthentication]} {...props} />;
}
