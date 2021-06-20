// React & Next
import { createContext, useContext, useEffect, useState } from "react";

// Config
import { host } from "../../config";

// Contexts
export const NotificationsContext = createContext();
import { UserContext } from "../auth/User";

function Notifications({ children }) {
	const [notifications, setNotifications] = useState([]);

	const { accessToken } = useContext(UserContext);

	const getNotifications = async () => {
		const res = await fetch(`${host}/notifications`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});
		if (res.ok) {
			const notifications = await res.json();
			setNotifications(notifications);
		}
	};

	useEffect(() => {
		if (accessToken) {
			getNotifications();
		}
	}, [accessToken]);

	return (
		<NotificationsContext.Provider
			value={{
				notifications,
				setNotifications,
			}}
		>
			{children}
		</NotificationsContext.Provider>
	);
}

export default Notifications;
