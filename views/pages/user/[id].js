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

	useEffect(getUser, [accessToken, id]);

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
