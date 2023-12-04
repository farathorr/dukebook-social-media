import { useEffect, useState } from "react";
import style from "./ChatField.module.scss";
import { api } from "../../../api";

export default function ChatField({ groupId, setUpdate }) {
	const [fieldText, setFieldText] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!fieldText || !groupId) return;
		try {
			const { data, status } = await api.sendMessage({ groupId: groupId, text: fieldText });
			if (status === 201) setUpdate(data);
			setFieldText("");
		} catch (err) {}
	};

	return (
		<form className={style["chat-input"]} onSubmit={handleSubmit}>
			<textarea
				className={style["text-field"]}
				name="message"
				placeholder="Type a message..."
				onInput={(e) => {
					const input = e.target;
					input.style.height = "";
					input.style.height = input.scrollHeight + "px";
				}}
				onChange={(e) => setFieldText(e.target.value)}
				value={fieldText}
			/>
			<button className={style["send-button"]} type="submit">
				Send
			</button>
			<button className={style["attach-button"]}>Attach</button>
		</form>
	);
}
