import React from "react";
import style from "./ScrollTopButton.module.scss";
import { useState, useEffect } from "react";
import CustomButton from "../CustomButton/CustomButton";

export default function ScrollTopButton() {
	const [isButtonVisible, setIsButtonVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 600) setIsButtonVisible(true);
			else setIsButtonVisible(false);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

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
