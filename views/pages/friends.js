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
			...(await serverSideTranslations(locale, ["common", "friends", "date"])),
		},
	};
}

function Friends() {
	const { t } = useTranslation(["common", "friends"]);

	const { accessToken } = useContext(UserContext);
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(true);

	const getFriends = async () => {
		const res = await fetch(`${host}/friend`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});
		const { error, friends } = await res.json();
		if (res.ok) {
			setLoading(false);
			setFriends(friends);
		}
	};

	useEffect(() => getFriends(), [accessToken]);

	return (
		<Auth>
			<Meta title={`${t("friends:meta-title")} | ChopTheBill`} />
			<Layout title={t("friends:meta-title")}>
				{loading ? (
					<Loader size="4rem" />
				) : friends.length ? (
					<FriendList friends={friends} setFriends={setFriends} />
				) : (
					<Empty />
				)}
			</Layout>
		</Auth>
	);
}

export default Friends;
