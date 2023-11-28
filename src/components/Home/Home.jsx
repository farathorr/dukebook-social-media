import { useContext, useEffect } from "react";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import { api } from "../../api";

export default function Home() {
	const [authentication] = useContext(AuthenticationContext);

	useEffect(() => {
		console.log("???");
		async function fetchData() {
			try {
				const { data } = await api.sensitiveData();
				console.log(data);
			} catch (err) {}
		}

		fetchData();
	}, [authentication]);

	return <div>Home</div>;
}
