import style from "./ChatHeader.module.scss";
import UserPicture from "../../../components/UserPicture/UserPicture";
import UserTag from "../../../components/UserTag/UserTag";

export default function ChatHeader({ group }) {
	return (
		<div className={style["chat-bar"]}>
			<div className={style["content"]}>
				<UserPicture src={group.image} size="big" className={style["picture"]} />
				<div>
					{group.type === "group" ? (
						<p className={style["name"]}>{group.name}</p>
					) : (
						<UserTag tag={group.name} className={style["name"]} isLink={true} />
					)}
					{group.type === "group" && <p className={style["user-status"]}>{group.participants.length} Members</p>}
					{group.type === "chat" && (
						<div className={style["status-container"]}>
							<div className={style["user-status-indicator"]}></div>
							<span className={style["user-status"]}>Online</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
