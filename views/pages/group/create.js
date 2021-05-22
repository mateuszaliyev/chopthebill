// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Auth from "../../components/auth/Auth";
import Layout from "../../components/layout/Layout";
import Meta from "../../components/Meta";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../../components/auth/User";

// Material UI
import {
	makeStyles,
	ListItemSecondaryAction,
	TextField,
	IconButton,
	ListItem,
	List,
	Button,
	Tooltip,
	ListItemText,
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "groups"])),
		},
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 600,
		backgroundColor: theme.palette.background.paper,
		paddingLeft: 20
	},
	input: {
		marginTop: 20,
		marginBottom: 20,
		display: 'block'
	}
}));

function GroupCreate() {
    const router = useRouter();
	const classes = useStyles();
	const { t } = useTranslation(["common", "groups"]);

	const { user, accessToken } = useContext(UserContext);
	const [groupFields, setGroupFields] = useState({
		name: "",
		description: "",	
		members: [{id: user.id_user, name: user.username}]
	});



    const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await fetch(`${host}/groups/create`, {
			method: "POST",
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(groupData),
		});
		
		if (res.ok)
		{
			const data = await res.json();
		}
	};

	const addMember = () => {
		const newMembers = groupFields.members;
		newMembers.push({id: newMembers.length, name: "nowy_placeholder"});
		setGroupFields((prevFields) => ({
			...prevFields,
			members: newMembers
		}));
	};

	const removeMember = (index) => {
		return () => {
			const newMembers = groupFields.members;
			newMembers.splice(index, 1);
			setGroupFields((prevFields) => ({
				...prevFields,
				members: newMembers
			}));
		}
	};

	const changeName = (e) => {
		setGroupFields({
			...groupFields,
			name: e.target.value
		});
	};

	const changeDescription = (e) => {
		setGroupFields({
			...groupFields,
			description: e.target.value
		});
	};

	return (
		<Auth>
			<Meta title={`${t("groups:meta-title")} | ChopTheBill`} />
			<Layout title={`${t("groups:meta-title")}`}>
				<form onSubmit={handleSubmit} className={classes.root}>
					<TextField
						className={classes.input} 
						id="form-name"
						label={`${t("groups:group-name")}`}
						onChange={changeName}
						required
					/>
					<TextField 
						className={classes.input}
						id="form-description"
						label={`${t("groups:group-description")}`}
						onChange={changeDescription}
						multiline
						rows={3}
					/>
					
					<Button
						variant="contained"
						color="primary"
						onClick={addMember}
					>
						Dodaj
					</Button>
					<List>
						{groupFields.members.map((member, index) => (
							<ListItem
								key={index}
								className={classes.input}
								label={`Member ${index}`}
								fullWidth
							>
								<ListItemText 
									primary={member.name}
								/>
								<ListItemSecondaryAction>
									<Tooltip title={`${t("groups:delete-button")}`}>
										<IconButton
											edge="end"
											color="secondary"
											onClick={removeMember(index)}
										>
											<CloseIcon />
										</IconButton>
									</Tooltip>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				</form>
			</Layout>
		</Auth>
	);
}

export default GroupCreate;
