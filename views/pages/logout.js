// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

// IndexedDB
import { set } from "idb-keyval";

// Components
import Auth from "../components/auth/Auth";
import Loader from "../components/Loader";

// Config
import { host } from "../config";

// Contexts
import { UserContext } from "../components/auth/User";

function Logout() {
	const [loggedOut, setLoggedOut] = useState(false);
	const { accessToken, setAccessToken, setUser } = useContext(UserContext);
	const router = useRouter();

	const logout = async () => {
		const res = await fetch(`${host}/logout`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (res.ok) {
			await set("refresh-token", "");
			setAccessToken("");
			setLoggedOut(true);
			setUser({});
		}
	};

	useEffect(() => {
		if (accessToken) {
			logout();
		}
	}, [accessToken]);

	useEffect(() => {
		if (!accessToken && loggedOut) {
			router.replace("/login");
		}
	}, [accessToken, loggedOut]);

	return (
		<Auth>
			<div style={{ height: "100vh" }}>
				<Loader size="4rem" />
			</div>
		</Auth>
	);
}

export default Logout;
