// React & Next
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

// Config
import { host } from "../../config";

// Context
import { JWTContext } from "../../pages/_app";

function Redirect({ children }) {
	const router = useRouter();
	const { accessToken, setAccessToken } = useContext(JWTContext);

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
		const res = await fetch(`${host}/refresh`, {
			method: "GET",
			credentials: "include",
		});
		if (res.ok) {
			const data = await res.json();
			setAccessToken(data.accessToken);
		}
	};

	useEffect(() => {
		authenticate();
	}, [accessToken]);

	return children;
}

export default Redirect;
