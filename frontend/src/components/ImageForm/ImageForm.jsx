import SettingsIcon from "../../svg/SettingsIcon";
import TrashSvg from "../../svg/TrashSvg";
import style from "./ImageForm.module.scss";
import { ImageUploaderContext } from "../ImageUploader/ImageUploader";
import { useContext } from "react";
export default function ImageForm({ images = [], setImages }) {
	const { imageUploader } = useContext(ImageUploaderContext);

	return (
		<>
			{images?.length > 0 && (
				<div className={style["image-container"]}>
					{images.map((image, index) => (
						<div className={style["image-wrapper"]} key={image + index}>
							<SettingsIcon
								className={style["settings-svg"]}
								onClick={() => {
									imageUploader((url) => setImages((images) => images.map((image, i) => (i === index ? url : image))));
								}}
							/>
							<TrashSvg
								className={style["trash-svg"]}
								onClick={() => {
									setImages((images) => images.filter((_, i) => i !== index));
								}}
							/>
							<img key={index} src={image} alt="post" />
						</div>
					))}
				</div>
			)}
		</>
	);
}
