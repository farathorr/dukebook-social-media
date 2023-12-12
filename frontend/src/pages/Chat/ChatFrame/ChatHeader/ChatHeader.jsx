import style from "./ChatHeader.module.scss";
import UserPicture from "../../../../components/UserPicture/UserPicture";
import UserTag from "../../../../components/UserTag/UserTag";

export default function ChatHeader({ image, name }) {
	return (
		<div className={style["chat-bar"]}>
			<UserPicture src={image} size="small" />
			<div className={style["bar-user-info-container"]}>
				<UserTag tag={name} isLink={true} />
				<div className={style["user-status-indicator"]} />
				<span className={style["user-status"]}>Online</span>
			</div>
		</div>
	);
}
