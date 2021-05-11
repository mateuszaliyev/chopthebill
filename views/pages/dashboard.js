// React & Next
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Auth from "../components/auth/Auth";
import Empty from "../components/Empty";
import Layout from "../components/layout/Layout";
import Meta from "../components/Meta";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "dashboard"])),
		},
	};
}

function Dashboard() {
	const { t } = useTranslation(["common", "dashboard"]);

	return (
		<Auth>
			<Meta title={`${t("dashboard:meta-title")} | ChopTheBill`} />
			<Layout title={`${t("dashboard:meta-title")}`}>
				<Empty />
			</Layout>
		</Auth>
	);
}

export default Dashboard;
