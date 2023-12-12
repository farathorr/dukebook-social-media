import { useMemo } from "react";
import style from "./UserPicture.module.scss";

export default function UserPicture({ src, size }) {
	const key = src + size;

	if (!src) console.trace(src);

	const memorizedImage = useMemo(() => {
		if (size === "big") {
			return <img src={src || "https://i.imgur.com/XY5aZDk.png"} alt="ProfilePicture" className={style["profile-big-pic"]} />;
		} else return <img src={src || "https://i.imgur.com/XY5aZDk.png"} alt="ProfilePicture" className={style["profile-small-pic"]} />;
	}, [key]);

	return <>{memorizedImage}</>;
}
