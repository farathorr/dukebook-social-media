import style from "./MessageSeparator.module.scss";

export default function MessageSeparator({ date }) {
	console.log(date);
	return <div className={style["message-day-separator"]}>{date.longDate}</div>;
}
