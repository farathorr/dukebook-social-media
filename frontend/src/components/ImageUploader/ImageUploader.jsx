import { createContext, createRef, useEffect, useReducer, useState } from "react";
import { api } from "../../utils/api";
import style from "./ImageUploader.module.scss";

export const ImageUploaderContext = createContext();

const initialFile = {
	file: null,
	name: "",
	type: "",
	size: 0,
	isImage: false,
	url: "",
};

function reducer(state, action) {
	switch (action.type) {
		case "setFile": {
			const file = action.payload;
			const { name, type, size } = file;

			return { ...state, name, type, size, file, isImage: type.includes("image"), url: "" };
		}
		case "setUrl":
			return { ...state, url: action.payload, file: null, name: "", type: "", size: 0, isImage: false };
		case "isImage":
			return {
				...state,
				isImage: action.payload,
			};
		case "reset":
			return initialFile;
		default:
			return state;
	}
}

export default function ImageUploader(props) {
	const [file, dispatch] = useReducer(reducer, initialFile);
	const myDialog = createRef();

	const open = () => {
		myDialog.current.showModal();
		dispatch({ type: "reset" });
	};

	const close = () => {
		myDialog.current.close();
	};

	// useEffect(() => {
	// 	open();
	// }, []);

	const onPaste = (event) => {
		const clipboard = event.clipboardData || window.clipboardData;
		const [file] = clipboard.files;

		if (!file) return;

		dispatch({ type: "setFile", payload: file });

		const image = new Image();
		// image.onload = onLoad;

		// document.body.appendChild(image);
		// image.src = URL.createObjectURL(file);

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
				<div className={style["image-uploader-container"]}>
					{" "}
					<label className={style["file-upload"]}>
						<p className={style["upload-text"]}>Select file</p>
						<div className={style["flex"]}>
							<input
								type="file"
								onChange={(e) => {
									const file = e.target.files[0];
									dispatch({ type: "setFile", payload: file });
								}}
							/>
							<svg xmlns="http://www.w3.org/2000/svg" className={style["upload-svg"]} height={16} width={12} viewBox="0 0 384 512">
								<path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z" />
							</svg>
							<div className={style["file-info-text"]}>
								<p>
									<strong>File name: </strong>
									{file.name || "none"}
								</p>
								<p>
									<strong>File type: </strong>
									{file.type || "none"}
								</p>
								<p>
									<strong>File size: </strong>
									{formatBytes(file.size) || ""}
								</p>
							</div>
						</div>
					</label>
					<div className={style["url-input-container"]}>
						<svg xmlns="http://www.w3.org/2000/svg" className={style["url-svg"]} height={16} width={20} viewBox="0 0 640 512">
							<path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
						</svg>

						<input
							type="text"
							name=""
							id=""
							placeholder="Paste url or image"
							value={file.url}
							onChange={(e) => dispatch({ type: "setUrl", payload: e.target.value })}
						/>
					</div>
					<PreviewImage file={file} dispatch={dispatch} />
					<div className={style["footer"]}>
						<button
							onClick={(e) => {
								e.preventDefault();
								close();
							}}
						>
							Back
						</button>
						<button disabled={!file.isImage}>Upload</button>
					</div>
				</div>
			</dialog>
			{props.children}
		</ImageUploaderContext.Provider>
	);
}

const PreviewImage = ({ file, dispatch }) => {
	const [url, setUrl] = useState("");

	useEffect(() => {
		const image = new Image();
		image.onload = () => {
			setUrl(image.src);
			dispatch({ type: "isImage", payload: true });
		};
		image.onerror = () => setUrl("");

		if (file.url) image.src = file.url;
		else if (file.isImage) image.src = URL.createObjectURL(file.file);
		else setUrl("");
	}, [file.file, file.url]);

	if (url === "") return null;
	return <img src={url} onLoad={() => URL.revokeObjectURL(url)} />;
};

function formatBytes(bytes, decimals = 2) {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
