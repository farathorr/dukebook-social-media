import React from "react";
import style from "./ScrollTopButton.module.scss";
import { useState, useEffect } from "react";
import CustomButton from "../CustomButton";

export default function ScrollTopButton() {
	const [isButtonVisible, setIsButtonVisible] = useState(false);
	const [positionY, setPositionY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setPositionY(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll);
		if (positionY > 600) {
			setIsButtonVisible(true);
		} else {
			setIsButtonVisible(false);
		}
	}, [window.scrollY]);

	return (
		<>
			{isButtonVisible && (
				<CustomButton className={style["scroll-to-top-button"]} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
					Top
				</CustomButton>
			)}
		</>
	);
}
