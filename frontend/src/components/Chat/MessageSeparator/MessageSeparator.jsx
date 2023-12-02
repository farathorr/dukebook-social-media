import style from "./MessageSeparator.module.scss";

export default function MessageSeparator(props) {
	return <div className={style["message-day-separator"]}>{props.date}</div>;
}

MessageSeparator.defaultProps = {
	date: "17 November 2023",
};
