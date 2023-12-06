import { useState, useEffect, useContext } from "react";
import style from "./HeaderEditForm.module.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import { NotificationContext } from "../../NotificationControls/NotificationControls";
import { AuthenticationContext } from "../../AuthenticationControls/AuthenticationControls";
import { api } from "../../../api";

export default function HeaderEditForm(props) {
	const [addNotification] = useContext(NotificationContext);
	const { authentication } = useContext(AuthenticationContext);
	const params = useParams();
	const [username, setUsername] = useState("");
	const [userTag, setUserTag] = useState("");
	const [bio, setBio] = useState("");

	useEffect(() => {
		const fetchServices = async () => {
			const { data, status } = await api.getAuthUserInfo();
			console.log(data);
			setUsername(data.username);
			setUserTag(data.userTag);
			setBio(data.bio);
		};

		fetchServices();
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const user = { username, userTag, bio };
		if (!username || !userTag)
			return addNotification({ type: "info", title: "Empty fields", message: "Username and user tag are required" });

		console.log(authentication.user);
		try {
			if (userTag !== authentication.user.userTag) {
				const user = (await axios.get(`http://localhost:4000/users/userTag/${userTag}`)).data;
				if (user) return addNotification({ type: "info", title: "Duplicate name", message: "User tag is already in use!!!" });
			}

			await axios.patch(`http://localhost:4000/users/${authentication.user.userid}`, user);
			addNotification({ type: "success", title: "Success", message: "User info updated successfully" });
		} catch (err) {}
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
