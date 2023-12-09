import { createContext, createRef, useEffect, useState } from "react";
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

	// useEffect(() => {
	// 	open();
	// });

	return (
		<ImageUploaderContext.Provider value={{ open, close, myDialog }}>
			<dialog ref={myDialog} className={style["image-uploader-dialog"]}>
				<form>
					<input type="file" value={file} onChange={(e) => setFile(e.target.value)} />
					<br />
					<input type="text" name="" id="" placeholder="Paste url or image" />
					<button>Upload</button>
				</form>
			</dialog>
			{props.children}
		</ImageUploaderContext.Provider>
	);
}
