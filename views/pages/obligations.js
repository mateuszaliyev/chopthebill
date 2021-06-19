// React & Next
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Auth from "../components/auth/Auth";
import Empty from "../components/Empty";
import Layout from "../components/layout/Layout";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import ObligationList from "../components/expenses/ObligationList";

// Config
import { host } from "../config";

// Contexts
import { UserContext } from "../components/auth/User";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "expenses"])),
		},
	};
}

function Obligations() {
	const { t } = useTranslation();

	const { accessToken } = useContext(UserContext);
	const [obligations, setObligations] = useState([]);
	const [loading, setLoading] = useState(true);
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
		setLoading(false);
	};
	useEffect(() => {
		if (accessToken) {
			getObligations();
		}
	}, [accessToken]);
	return (
		<Auth>
			<Meta title={`${t("obligations")} | ChopTheBill`} />
			<Layout title={`${t("obligations")}`}>
				{loading ? (
					<Loader size="4rem" />
				) : obligations.length > 0 ? (
					<ObligationList
						obligations={obligations}
						setObligations={setObligations}
					/>
				) : (
					<Empty />
				)}
			</Layout>
		</Auth>
	);
}

export default Obligations;
