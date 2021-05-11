import { useRouter } from "next/router";
import Auth from "../../components/auth/Auth";
import Layout from "../../components/layout/Layout";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../components/auth/User";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { host } from "../../config";

import Meta from "../../components/Meta";

import Profile from "../../components/user/Profile";
import Settings from "../../components/user/Settings";

import Container from "@material-ui/core/Container";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "dashboard"])),
		},
	};
}

function Account() {
	const { t } = useTranslation("common");

	const router = useRouter();
	const { id } = router.query;

	const { user: loggedUser, accessToken } = useContext(UserContext);

	const [user, setUser] = useState({});

	const getUser = async () => {
		if (id !== loggedUser.id) {
			const res = await fetch(`${host}/user/${id}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			const { error, user } = await res.json();
			if (res.ok) {
				setUser(user);
			}
		} else {
			setUser(loggedUser);
		}
	};

	useEffect(getUser, [accessToken]);

	return (
		<Auth>
			<Meta title={`${user.username} | ChopTheBill`} />
			<Layout title={t("profile")}>
				<Container maxWidth="sm">
					{user.username && <Profile user={user}></Profile>}
					{user.username && loggedUser.id === id && <Settings />}
				</Container>
			</Layout>
		</Auth>
	);
}

export default Account;
