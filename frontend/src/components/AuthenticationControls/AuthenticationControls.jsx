import { createContext, useEffect, useReducer, useState } from "react";
import { api } from "../../api";

export const AuthenticationContext = createContext(null);

const initialState = {
	isAuthenticated: false,
	callback: null,
};

function reducer(state, action) {
	switch (action.type) {
		case "login":
			return { ...state, isAuthenticated: true, user: action.user, rememberPassword: action.rememberPassword ?? false };
		case "logout":
			return { ...state, isAuthenticated: false, user: null };
		case "update":
			return { ...state, user: action.user };
		case "callback":
			return { ...state, callback: action.callback };
		default:
			return Error("Invalid action type");
	}
}

export default function AuthenticationControls(props) {
	const [authentication, dispatchAuthentication] = useReducer(reducer, initialState);

	useEffect(() => {
		const fetchData = async () => {
			const { data, status } = await api.getAuthUserInfo();
			if (status !== 200) return;
			authentication.isAuthenticated = true;

			dispatchAuthentication({ type: "login", user: data, rememberPassword: true });
		};

		fetchData();
	}, []);

	return <AuthenticationContext.Provider value={{ authentication, dispatchAuthentication }} {...props} />;
}
