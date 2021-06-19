// React & Next
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Auth from "../components/auth/Auth";
import GroupList from "../components/groups/GroupList";
import Layout from "../components/layout/Layout";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

// Config
import { host } from "../config";

// Contexts
import { UserContext } from "../components/auth/User";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "groups"])),
		},
	};
}

function Groups() {
	const { t } = useTranslation();

	const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(true);

	const { accessToken } = useContext(UserContext);

	const getGroups = async () => {
		const res = await fetch(`${host}/groups`, {
			method: "GET",
			credentials: "include",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			const groups = await res.json();
			setGroups(groups);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (accessToken) {
			getGroups();
		}
	}, [accessToken]);

	return (
		<Auth>
			<Meta title={`${t("groups:meta-title")} | ChopTheBill`} />
			<Layout title={`${t("groups:meta-title")}`}>
				{loading ? (
					<Loader size="4rem" />
				) : (
					<GroupList groups={groups} setGroups={setGroups} />
				)}
			</Layout>
		</Auth>
	);
}

export default Groups;
