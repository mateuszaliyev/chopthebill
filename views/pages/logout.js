// React & Next
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

// Components
import Auth from "../components/auth/Auth";
import Loader from "../components/Loader";

// Config
import { host } from "../config";

// Context
import { UserContext } from "../components/auth/User";

function Logout() {
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
			setAccessToken("");
			setUser({});
			router.push("/login");
		}
	};

	useEffect(logout, [accessToken]);

	return (
		<Auth>
			<div className="center">
				<Loader />
			</div>
		</Auth>
	);
}

export default Logout;