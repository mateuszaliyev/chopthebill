// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Auth from "../../components/auth/Auth";
import Layout from "../../components/layout/Layout";
import Meta from "../../components/Meta";
import SearchUserDialog from "../../components/group/SearchUserDialog";
import Avatar from "../../components/Avatar";

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
	Checkbox,
	ListItemAvatar,
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
	const [result, setResult] = useState("");
	const [groupInfo, setGroupInfo] = useState({
		name: "",
		description: ""
	});
	const [groupMembers, setGroupMembers] = useState([
		{id: user.id_user, name: user.username, owner: true},
	]);

    const handleSubmit = async (e) => {
		e.preventDefault();

		const groupData = {
			...groupInfo,
			members: groupMembers.map(m => ({id_user: m.id, owner: m.owner}))
		}
		console.log("Dane: ", groupData);
		console.log(groupInfo);

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
			setResult(data.result);
		}
	};

	const addMember = (id, username) => {
		return () => {
			const newMembers = groupMembers;
			if (!groupMembers.some(m => m.id == id)) {
				newMembers.push({id: id, name: username, owner: false});
			}
			setGroupMembers([...newMembers]);
		}
	};

	const removeMember = (index) => {
		return () => {
			const newMembers = groupMembers;
			newMembers.splice(index, 1);
			setGroupMembers([...newMembers]);
		}
	};

	const changeOwnership = (index) => {
		return (event) => {
			const newMembers = groupMembers;
			newMembers[index].owner = event.target.checked;
			setGroupMembers([...newMembers]);
		}
	};

	const changeName = (e) => {
		setGroupInfo({
			...groupInfo,
			name: e.target.value
		});
	};

	const changeDescription = (e) => {
		setGroupInfo({
			...groupInfo,
			description: e.target.value
		});
	};

	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		const newMembers = groupMembers;
		newMembers[0].id = user.id;
		newMembers[0].name = user.username;
		setGroupMembers([...newMembers]);
	}, [user]);

	useEffect(() => {
		if (result == "created") {
			router.back();
		}
	}, [result]);

	return (
		<Auth>
			<Meta title={`${t("groups:meta-title")} | ChopTheBill`} />
			<Layout title={`${t("groups:meta-title")}`}>
				<form className={classes.root}>
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
						onClick={handleClick}
					>
						{`${t("common:add-user")}`}
					</Button>
					<SearchUserDialog onClose={handleClose} open={open} title={`${t("common:add-user")}`} addMember={addMember}/>
					<List>
						{groupMembers.map((member, index) => (
							<div key={index}>
								<ListItem
									className={classes.input}
									label={`Member ${index}`}
								>
									<ListItemText 
										primary={member.name}
									/>
									<Tooltip title={`${t("groups:group-owner")}`}>
										<Checkbox 
											checked={member.owner ? true : false}
											onChange={changeOwnership(index)}
										/>
									</Tooltip>
									<ListItemSecondaryAction>
										<Tooltip title={`${t("groups:delete-button")}`}>
											<IconButton
												edge="end"
												color="primary"
												onClick={removeMember(index)}
											>
												<CloseIcon />
											</IconButton>
										</Tooltip>
									</ListItemSecondaryAction>
								</ListItem>
							</div>
						))}
					</List>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
					>
						{`${t("groups:create-group")}`}
					</Button>
				</form>
			</Layout>
		</Auth>
	);
}

export default GroupCreate;
