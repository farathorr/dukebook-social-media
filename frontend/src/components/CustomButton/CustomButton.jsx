import { Link } from "react-router-dom";
import style from "./CustomButton.module.scss";

export default function Button({ to, children, className, purpose, ...props }) {
	const purposeSwitch = {
		action: style["action"],
		primary: style["primary"],
		secondary: style["secondary"],
		tertiary: style["tertiary"],
		warning: style["warning"],
		dark: style["dark"],
	};

	const classes = [style["button"]];
	if (className) classes.push(className);
	if (purpose in purposeSwitch) classes.push(purposeSwitch[purpose]);

	if (to) {
		return (
			<Link className={classes.join(" ")} to={to} {...props}>
				{children}
			</Link>
		);
	}

	return (
		<button className={classes.join(" ")} {...props}>
			{children}
		</button>
	);
}
