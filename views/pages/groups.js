// React & Next
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Auth from "../components/auth/Auth";
import Layout from "../components/layout/Layout";
import Meta from "../components/Meta";
import Link from "../components/Link";
import GroupList from "../components/group/groupList";

// Config
import { host } from "../config";

// Contexts
import { UserContext } from "../components/auth/User";

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import {
	IconButton,
	Fab,
	Tooltip
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "groups"])),
		},
	};
}

const useStyles = makeStyles((theme) => ({
	absolute: {
		position: 'absolute',
		bottom: theme.spacing(2),
		right: theme.spacing(3),
	},
}));

function Groups() {
	const { t } = useTranslation(["common", "groups"]);
	const classes = useStyles();

	const { user, accessToken } = useContext(UserContext);

	const [results, setResults] = useState([]);
	const [refreshGroups, setRefreshGroups] = useState(true);

	const refreshGroupList = () => {
		setRefreshGroups((prev) => !prev);
	}

	const getGroups = async () => {
		const res = await fetch(`${host}/groups`, {
			method: "POST",
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(user),
		});
		
		if (res.ok)
		{
			const data = await res.json();
			setResults(data.result);
		}
	}

	useEffect(() => {getGroups()}, [refreshGroups]);
	
	return (
		<Auth>
			<Meta title={`${t("groups:meta-title")} | ChopTheBill`} />
			<Layout title={`${t("groups:meta-title")}`}>
				<GroupList groups={results} refreshGroupList={refreshGroupList}/>
					<Tooltip title={`${t("groups:create-button")}`}>
						<Fab className={classes.absolute} color="secondary" 
						component={Link} href="/group/create" as="/group/create"
						>
							<AddIcon fontSize="large" variant="contained"/>
						</Fab>
					</Tooltip>
			</Layout>
		</Auth>
	);
}

export default Groups;
