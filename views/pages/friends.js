// React & Next
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Config
import { host } from "../config";

// Components
import Auth from "../components/auth/Auth";
import Empty from "../components/Empty";
import FriendList from "../components/friends/FriendList";
import Layout from "../components/layout/Layout";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

// Contexts
import { UserContext } from "../components/auth/User";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "date", "friends"])),
		},
	};
}

function Friends() {
	const { t } = useTranslation();

	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(true);

	const { accessToken } = useContext(UserContext);

	const getFriends = async () => {
		const res = await fetch(`${host}/friends`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});
		if (res.ok) {
			const friends = await res.json();
			setLoading(false);
			setFriends(friends);
		}
	};

	useEffect(() => {
		if (accessToken) {
			getFriends();
		}
	}, [accessToken]);

	return (
		<Auth>
			<Meta title={`${t("friends:meta-title")} | ChopTheBill`} />
			<Layout title={t("friends:meta-title")}>
				{loading ? (
					<Loader size="4rem" />
				) : (
					<>
						{friends.length === 0 && <Empty />}
						<FriendList friends={friends} setFriends={setFriends} />
					</>
				)}
			</Layout>
		</Auth>
	);
}

export default Friends;
