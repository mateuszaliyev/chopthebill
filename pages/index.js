import { useEffect } from "react";
import { host } from "../config";

export async function getServerSideProps() {
	const res = await fetch(`${host}/hello`);
	const data = await res.json();
	return {
		props: {
			data,
		},
	};
}

export default function Home({ data }) {
	useEffect(() => {
		document.documentElement.lang = "en";
	}, []);

	return <h1>{data.message}</h1>;
}
