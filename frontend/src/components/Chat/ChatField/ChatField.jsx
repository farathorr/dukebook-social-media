import { useEffect, useRef, useState } from "react";
import style from "./ChatField.module.scss";
import { api } from "../../../api";

export default function ChatField({ groupId, setUpdate }) {
	const [fieldText, setFieldText] = useState("");
	const textArea = useRef(null);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!fieldText || !groupId) return;
		try {
			const { data, status } = await api.sendMessage({ groupId: groupId, text: fieldText });
			if (status === 201) setUpdate(data);
			setFieldText("");
		} catch (err) {}
	};

	useEffect(() => {
		if (fieldText.length === 0) sizeTextArea();
	}, [fieldText]);

	const sizeTextArea = () => {
		if (!textArea.current) return;
		textArea.current.style.height = "";
		textArea.current.style.height = textArea.current.scrollHeight + "px";
	};

	return (
		<form className={style["chat-input"]} onSubmit={handleSubmit}>
			<textarea
				className={style["text-field"]}
				autoComplete="off"
				autoCorrect="off"
				spellCheck="false"
				autoCapitalize="off"
				name="message"
				placeholder="Type a message..."
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						handleSubmit(e);
					}
				}}
				ref={textArea}
				onChange={(e) => {
					setFieldText(e.target.value);
					sizeTextArea();
				}}
				value={fieldText}
			/>
			<button className={style["send-button"]} type="submit">
				Send
			</button>
			<button className={style["attach-button"]}>Attach</button>
		</form>
	);
}
