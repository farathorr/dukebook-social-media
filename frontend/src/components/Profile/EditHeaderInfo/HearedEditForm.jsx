import { useState, useEffect, useContext } from "react";
import style from "./HeaderEditForm.module.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NotificationContext } from "../../../context/NotificationControls/NotificationControls";
import { AuthenticationContext } from "../../../context/AuthenticationContext/AuthenticationContext";
import { api } from "../../../utils/api";

export default function HeaderEditForm() {
	const [addNotification] = useContext(NotificationContext);
	const { authentication, dispatchAuthentication } = useContext(AuthenticationContext);
	const [username, setUsername] = useState("");
	const [userTag, setUserTag] = useState("");
	const [bio, setBio] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (!authentication.user) return;

		setUsername(authentication.user.username);
		setUserTag(authentication.user.userTag);
		setBio(authentication.user.bio);
	}, [authentication]);

	const callback = async () => {
		const userData = { username, userTag, bio };
		const { status } = await api.updateAuthUser(userData);
		if (status === 403) {
			dispatchAuthentication({ type: "callback", callback });
			navigate("/authentication");
			return;
		}
		if (status !== 200) return;
		addNotification({ type: "success", message: "Settings updated succesfully", title: "Authentication successful", duration: 2000 });

		const { status: status2, data } = await api.getAuthUserInfo();
		if (status2 !== 200)
			return addNotification({ type: "error", message: "Failed to get user info", title: "Failed to get user info", duration: 5000 });

		dispatchAuthentication({ type: "update", user: data });
		navigate("/profile");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		callback();
	};

	return (
		<form className={style["header-edit-form"]} onSubmit={handleSubmit}>
			<label>
				Username:
				<input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
			</label>
			<label>
				User Tag:
				<input type="text" name="userTag" placeholder="UserTag" value={userTag} onChange={(e) => setUserTag(e.target.value)} />
			</label>
			<label>
				Bio:
				<textarea name="bio" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
			</label>
			<button type="submit">Save Changes</button>
		</form>
	);
}
