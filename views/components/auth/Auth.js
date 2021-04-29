// React & Next
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

// Config
import { host } from "../../config";

// Context
import { JWTContext } from "../../pages/_app";

function Auth(props) {
	const { accessToken, refreshToken } = useContext(JWTContext);

	const authenticate = async () => {
		const res = await fetch(`${host}/access`, {
			method: "GET",
			// credentials: "include",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		console.log(res.status);
	};

	useEffect(authenticate, []);

	return props.children;
}

export default Auth;
