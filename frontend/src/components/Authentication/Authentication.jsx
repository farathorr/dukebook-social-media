import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import { api } from "../../api";
import style from "./Authentication.module.scss";

export default function Authentication() {
	const { authentication } = useContext(AuthenticationContext);
	const [password, setPassword] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();
	};

	useEffect(() => {});

	return (
		<form action="" onSubmit={handleSubmit} className={style["authentication-form"]}>
			<div>
				<h1>Authentication</h1>
				<p>Enter your password</p>
			</div>
			<div className={style["profile-info"]}>
				<img src={require("../../images/Duke3D.png")} alt="profile picture" />
				<span className={style.username}>{authentication.user?.username}</span>
				<span className={style.usertag}>{authentication.user?.userTag}</span>
			</div>
			<div className={style["footer"]}>
				<input type="password" placeholder="Password" value={password} onInput={(e) => setPassword(e.target.value)} />
				<button>Done</button>
			</div>
		</form>
	);
}
