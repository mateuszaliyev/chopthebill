// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

// IndexedDB
import { get } from "idb-keyval";

// Components
import Loader from "../Loader";
import Notifications from "../layout/Notifications";

// Config
import { host } from "../../config";

// Contexts
import { ThemeContext } from "../Theme";
import { UserContext } from "./User";

function Auth(props) {
	const [authenticated, setAuthenticated] = useState(false);

	const { setPalette, setTheme } = useContext(ThemeContext);
	const { accessToken, setAccessToken, user, setUser } =
		useContext(UserContext);

	const router = useRouter();

	const authenticate = async () => {
		const res = await fetch(`${host}/access`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (res.ok) {
			const user = await res.json();
			setPalette(user.theme.split("-")[1] || "light");
			setTheme(user.theme.split("-")[0] || "default");
			setUser(user);
			setAuthenticated(true);
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
			router.push("/login");
		}
	};

	const handleAuthentication = async () => {
		const refreshToken = await get("refresh-token");

		if (accessToken) {
			authenticate();
		} else if (refreshToken) {
			getAccessToken();
		} else {
			router.push("/login");
		}
	};

	useEffect(() => {
		handleAuthentication();
	}, [accessToken]);

	useEffect(() => {
		const interval = setInterval(() => {
			getAccessToken();
		}, 1000 * 60 * 14);
		return () => clearInterval(interval);
	}, [accessToken]);

	return authenticated && user ? (
		<Notifications>{props.children}</Notifications>
	) : (
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
	);
}

export default Auth;
