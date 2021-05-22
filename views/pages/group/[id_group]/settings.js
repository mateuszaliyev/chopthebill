// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Auth from "../../../components/auth/Auth";
import Layout from "../../../components/layout/Layout";
import Meta from "../../../components/Meta";
import MemberList from "../../../components/group/MemberList";

// Config
import { host } from "../../../config";

// Contexts
import { UserContext } from "../../../components/auth/User";

// Material UI
import {
	TextField,
	Button,
} from "@material-ui/core";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "groups"])),
		},
	};
}

function GroupSettings() {
    const router = useRouter();
    const { id_group } = router.query;
	const { t } = useTranslation(["common", "groups"]);

	const { user, accessToken } = useContext(UserContext);
	const [results, setResults] = useState([]);
	const [groupName, setGroupName] = useState('');
	const [groupDescription, setGroupDescription] = useState('');

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

	useEffect(() => {getMembers()}, []);

	const handleName = (e) => {
		setGroupName(e.target.value);
	};

	const handleDescription = (e) => {
		setGroupDescription(e.target.value);
	};

	const changeName = async () => {
		const res = await fetch(`${host}/groups/name`, {
			method: "PUT",
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				"id_group": id_group,
				"id_user": user.id,
				"name": groupName
			}),
		});
	};

	const changeDescription = async () => {
		const res = await fetch(`${host}/groups/description`, {
			method: "PUT",
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				"id_group": id_group,
				"id_user": user.id,
				"description": groupDescription
			}),
		});
	};

	return (
		<Auth>
			<Meta title={`${t("groups:meta-title")} | ChopTheBill`} />
			<Layout title={`${t("groups:meta-title")}`}>
				<h1>Group Settings</h1>
				<TextField
					id="form-name"
					label={`${t("groups:group-name")}`}
					onChange={handleName}
				/>
				<Button 
					variant="outlined"
					color="secondary"
					onClick={changeName}
				>
					{`${t("groups:change-name")}`}
				</Button>
				<br />
				<TextField 
					id="form-description" 
					label={`${t("groups:group-description")}`}
					onChange={handleDescription}
					multiline
					rows={3}
				/>
				<Button
					variant="outlined"
					color="secondary"
					onClick={changeDescription}
				>
					{`${t("groups:change-description")}`}
				</Button>
                <MemberList members={results} />
			</Layout>
		</Auth>
	);
}

export default GroupSettings;
