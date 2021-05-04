// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Components
import Loader from "../Loader";

// Config
import { host } from "../../config";

// Context
import { UserContext } from "./User";

function Auth(props) {
	const router = useRouter();
	const { accessToken, setAccessToken, user, setUser } = useContext(
		UserContext
	);
	const [authenticated, setAuthenticated] = useState(false);

	const authenticate = async () => {
		const res = await fetch(`${host}/access`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		if (res.ok) {
			const user = await res.json();
			setUser(user);
			setAuthenticated(true);
		} else {
			getAccessToken();
		}
	};

	const getAccessToken = async () => {
		const res = await fetch(`${host}/refresh`, {
			method: "GET",
			credentials: "include",
		});
		if (res.ok) {
			const data = await res.json();
			setAccessToken(data.accessToken);
		} else {
			router.push("/login");
		}
	};

	useEffect(authenticate, [accessToken]);

	return authenticated && user ? props.children : <Loader />;
}

export default Auth;
