import { Link } from "react-router-dom";
import style from "./ChatHeader.module.scss";
import UserPicture from "../../../../components/UserPicture/UserPicture";

export default function ChatHeader({ image, name }) {
	return (
		<div className={style["chat-bar"]}>
			<UserPicture src={image} size="small" />
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
