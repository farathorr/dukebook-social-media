import { Link } from "react-router-dom";
import style from "./NavButton.module.scss"

export default function NavButton({ children, ...props }) {
	return <Link {...props}>{children}</Link>;
}
