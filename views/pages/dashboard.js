// React & Next
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Language from "../components/Language";
import Meta from "../components/Meta";
import SideMenu from "../components/SideMenu";

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
		<>
			<Meta title={`${t("dashboard:meta-title")} | ChopTheBill`} />
			<SideMenu />
			<Language />
			<h1>Dashboard</h1>
		</>
	);
}

export default Dashboard;
