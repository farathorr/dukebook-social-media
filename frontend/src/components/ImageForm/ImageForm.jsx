import TrashSvg from "../../svg/TrashSvg";
import style from "./ImageForm.module.scss";

export default function ImageForm({ images = [], setImages }) {
	return (
		<>
			{images?.length > 0 && (
				<div className={style["image-container"]}>
					{images.map((image, index) => (
						<div className={style["image-wrapper"]}>
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
