import { Link } from "react-router-dom";
import style from "./ChatHeader.module.scss";

export default function ChatHeader({ image, name }) {
	return (
		<div className={style["chat-bar"]}>
			<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
			<div className={style["bar-user-info-container"]}>
				<Link className={style["user-name"]} to={`/user/${name}`}>
					@{name}
				</Link>
				<div className={style["user-status-indicator"]} />
				<span className={style["user-status"]}>Online</span>
			</div>
		</div>
	);
}
