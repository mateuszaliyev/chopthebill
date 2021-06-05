// React & Next
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ObligationList from "../components/expenses/ObligationList";
import { host } from "../config";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/auth/User";

// Components
import Auth from "../components/auth/Auth";
import Empty from "../components/Empty";
import Layout from "../components/layout/Layout";
import Meta from "../components/Meta";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "expenses"])),
		},
	};
}

function Obligations() {
	const { t } = useTranslation(["common", "expenses"]);

	const { accessToken } = useContext(UserContext);
	const [obligations, setObligations] = useState([]);
	const getObligations = async () => {
		const res = await fetch(`${host}/obligations`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});
		if (res.ok) {
			const obligations = await res.json();
			setObligations(obligations);
		}
	};
	useEffect(getObligations, [accessToken]);
	return (
		<Auth>
			<Meta title={`${t("obligations")} | ChopTheBill`} />
			<Layout title={`${t("obligations")}`}>
				<ObligationList obligations={obligations} />
			</Layout>
		</Auth>
	);
}

export default Obligations;
