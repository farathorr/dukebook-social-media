import { useMemo } from "react";
import style from "./UserPicture.module.scss";

export default function UserPicture({ src, size = "small", className }) {
	const key = src + size;
	const classString = `${style[`profile-${size}-pic`]} ${className || ""}`;

	const memorizedImage = useMemo(() => {
		if (size === "big") {
			return <img src={src || "https://i.imgur.com/XY5aZDk.png"} alt="ProfilePicture" className={classString} />;
		} else return <img src={src || "https://i.imgur.com/XY5aZDk.png"} alt="ProfilePicture" className={classString} />;
	}, [key]);

	return memorizedImage;
}
