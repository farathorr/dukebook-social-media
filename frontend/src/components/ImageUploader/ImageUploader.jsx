import { createContext, createRef, useEffect, useState } from "react";
import { api } from "../../api";
import style from "./ImageUploader.module.scss";

export const ImageUploaderContext = createContext();

export default function ImageUploader(props) {
	const [file, setFile] = useState("");
	const myDialog = createRef();

	const open = () => {
		myDialog.current.showModal();
	};

	const close = () => {
		myDialog.current.close();
	};

	useEffect(() => {
		open();
	});

	const onPaste = (event) => {
		const clipboard = event.clipboardData || window.clipboardData;
		const [file] = clipboard.files;

		const image = new Image();
		image.onload = onLoad;

		document.body.appendChild(image);
		image.src = URL.createObjectURL(file);

		async function onLoad() {
			URL.revokeObjectURL(image.src);
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;
			ctx.drawImage(image, 0, 0);
			const dataURL = canvas.toDataURL("image/png").replace("data:image/png;base64,", ""); // Imgur doesn't like the header

			const response = await api.uploadImage(dataURL);

			console.log(response);
		}
	};

	return (
		<ImageUploaderContext.Provider value={{ open, close, myDialog }}>
			<dialog ref={myDialog} className={style["image-uploader-dialog"]} onPaste={onPaste}>
				<form>
					<input type="file" value={file} onChange={(e) => setFile(e.target.value)} />
					<br />
					<input type="text" name="" id="" placeholder="Paste url or image" />
					<button>Upload</button>
				</form>
				<button
					onClick={async () => {
						const response = await api.deleteImage("Tm30MMqWGCDj0LO");
						console.log(response);
					}}
				>
					test
				</button>
			</dialog>
			{props.children}
		</ImageUploaderContext.Provider>
	);
}
