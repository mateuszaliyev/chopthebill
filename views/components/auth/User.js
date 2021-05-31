// React & Next
import { createContext, useState } from "react";

// Contexts
export const UserContext = createContext();

function User({ children }) {
	const [accessToken, setAccessToken] = useState("");
	const [user, setUser] = useState({});

	return (
		<UserContext.Provider
			value={{
				accessToken,
				setAccessToken,
				user,
				setUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export default User;
