// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Auth from "../../components/auth/Auth";
import Layout from "../../components/layout/Layout";
import Meta from "../../components/Meta";
import MemberList from "../../components/group/MemberList";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../../components/auth/User";

// Material UI

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "groups"])),
		},
	};
}

function Group() {
	const router = useRouter();
	const { id_group } = router.query;
	const { t } = useTranslation(["common", "groups"]);

	const { user, accessToken } = useContext(UserContext);
	const [results, setResults] = useState([]);

    const getMembers = async () => {
		const res = await fetch(`${host}/groups/members`, {
			method: "POST",
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({"id_group": id_group, "id_user": user.id}),
		});
		
		if (res.ok)
		{
			const data = await res.json();
			setResults(data.result);
		}
	}

	useEffect(() => {getMembers()}, [user]);

	return (
		<Auth>
			<Meta title={`${t("groups:meta-title")} | ChopTheBill`} />
			<Layout title={`${t("groups:meta-title")}`}>
				<MemberList members={results} getMembers={getMembers} />
			</Layout>
		</Auth>
	);
}

export default Group;
