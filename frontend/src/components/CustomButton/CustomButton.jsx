import { Link } from "react-router-dom";
import style from "./CustomButton.module.scss";

export default function Button({ to, children, className, purpose, ...props }) {
	const purposeSwitch = {
		action: style["action"],
		primary: style["primary"],
		secondary: style["secondary"],
		tertiary: style["tertiary"],
	};
	const purposeClass = purposeSwitch[purpose] || "";

	if (to) {
		return (
			<Link className={`${style["button"]} ${purposeClass} ${className}`} to={to} {...props}>
				{children}
			</Link>
		);
	}

	return (
		<button className={`${style["button"]} ${purposeClass} ${className}`} {...props}>
			{children}
		</button>
	);
}
