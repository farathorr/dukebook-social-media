import { useContext, useEffect } from "react";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import axios from "axios";

export default function Home() {
	const [authentication] = useContext(AuthenticationContext);

	useEffect(() => {
		console.log("???");
		async function fetchData() {
			try {
				const { data } = await axios.post("http://localhost:4000/users/getSensitiveData2");
				console.log(data);
			} catch (err) {}
		}

		fetchData();
	}, [authentication]);

	return <div>Home</div>;
}
