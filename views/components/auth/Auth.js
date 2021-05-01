// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Config
import { host } from "../../config";

// Context
import { JWTContext } from "../../pages/_app";

function Auth(props) {
	const router = useRouter();
	const {
		accessToken,
		refreshToken,
		setAccessToken,
		setRefreshToken,
	} = useContext(JWTContext);
	const [authenticated, setAuthenticated] = useState(false);

	const authenticate = async () => {
		const res = await fetch(`${host}/access`, {
			method: "GET",
			// credentials: "include",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		console.log(res.status);
		if (res.ok) {
			setAuthenticated(true);
		} else {
			getAccessToken();
		}
	};

	const getAccessToken = async () => {
		const res = await fetch(`${host}/refresh`, {
			method: "GET",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${refreshToken}`,
			},
		});

		if (res.ok) {
			const data = await res.json();
			setAccessToken(data.accessToken);
			setAuthenticated(true);
		} else {
			router.push("/login");
		}
	};

	useEffect(authenticate);
	return authenticated ? props.children : <h1>loading</h1>;
}

export default Auth;
