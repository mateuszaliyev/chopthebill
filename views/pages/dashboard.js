// React & Next
import { useContext } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Auth from "../components/auth/Auth";
import Layout from "../components/Layout";
import Link from "../components/Link";
import Meta from "../components/Meta";

// Contexts
import { UserContext } from "../components/auth/User";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "dashboard"])),
		},
	};
}

function Dashboard() {
	const { t } = useTranslation(["common", "dashboard"]);

	const { user } = useContext(UserContext);

	return (
		<Auth>
			<Meta title={`${t("dashboard:meta-title")} | ChopTheBill`} />
			<Layout title={`${t("dashboard:meta-title")}`}>
				<h1>{user.username}</h1>
			</Layout>
		</Auth>
	);
}

export default Dashboard;
