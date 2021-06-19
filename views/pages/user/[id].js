// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Material UI
import Container from "@material-ui/core/Container";

// Components
import Auth from "../../components/auth/Auth";
import Layout from "../../components/layout/Layout";
import Meta from "../../components/Meta";
import Profile from "../../components/user/Profile";
import Settings from "../../components/user/Settings";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../../components/auth/User";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, [
				"common",
				"date",
				"friends",
				"user",
				"validation",
			])),
		},
	};
}

function Account() {
	const { t } = useTranslation();

	const [user, setUser] = useState({});

	const { user: loggedUser, accessToken } = useContext(UserContext);

	const router = useRouter();
	const { id } = router.query;

	const getUser = async () => {
		if (id !== loggedUser.id) {
			const res = await fetch(`${host}/user/${id}`, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});
			if (res.ok) {
				const user = await res.json();
				setUser(user);
			} else {
				router.replace("/dashboard");
			}
		} else {
			setUser(loggedUser);
		}
	};

	useEffect(() => {
		if (accessToken) {
			getUser();
		}
	}, [accessToken, id]);

	return (
		<Auth>
			{user.username && <Meta title={`${user.username} | ChopTheBill`} />}
			<Layout title={t("profile")}>
				{user.username && (
					<Container maxWidth="sm">
						{user.username && <Profile setUser={setUser} user={user}></Profile>}
						{user.username && loggedUser.id === id && <Settings />}
					</Container>
				)}
			</Layout>
		</Auth>
	);
}

export default Account;
