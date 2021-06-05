// React & Next
import { useContext, useEffect, useState } from "react";
import Router, { useRouter } from "next/router";

// IndexedDB
import { get } from "idb-keyval";

// Components
import Loader from "../Loader";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "./User";

function Redirect({ children }) {
	const [loading, setLoading] = useState(true);
	const { accessToken, setAccessToken } = useContext(UserContext);

	const router = useRouter();

	const authenticate = async () => {
		const res = await fetch(`${host}/access`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		if (res.ok) {
			router.push("/dashboard");
		} else {
			getAccessToken();
		}
	};

	const getAccessToken = async () => {
		const refreshToken = await get("refresh-token");
		const res = await fetch(`${host}/refresh`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${refreshToken}`,
			},
		});
		if (res.ok) {
			const data = await res.json();
			setAccessToken(data.accessToken);
		} else {
			setLoading(false);
		}
	};

	useEffect(() => {
		authenticate();
	}, [accessToken]);

	Router.events.on("routeChangeComplete", () => {
		setLoading(false);
	});

	return loading ? (
		<main
			style={{
				display: "grid",
				height: "100vh",
				placeItems: "center",
				width: "100vw",
			}}
		>
			<Loader size="4rem" />
		</main>
	) : (
		children
	);
}

export default Redirect;
