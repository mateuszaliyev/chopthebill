// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useTranslation } from "next-i18next";

// Components
import Link from "../Link";
import AddMemberDialog from "../../components/group/AddMemberDialog";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../../components/auth/User";

import { makeStyles } from '@material-ui/core/styles';
// Material UI
import {
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Button,
	Divider,
	Tooltip,
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 600,
		backgroundColor: theme.palette.background.paper,
	},
  }));

const MemberList = ({members, getMembers}) => {
	const router = useRouter();
	const { id_group } = router.query;
	
	const { t } = useTranslation(["common", "groups"]);
	const classes = useStyles();
	const { user, accessToken } = useContext(UserContext);

	const deleteMember = async (id) => {
		const res = await fetch(`${host}/groups/member/delete`, {
			method: "POST",
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({"id_group": id_group, "id_user": id, "id_owner": user.id}),
		});
		
		if (res.ok)
		{
			const data = await res.json();
			console.log(data);

			getMembers();
		}
	}

	const addMember = async (id) => {
		const res = await fetch(`${host}/groups/member/add`, {
			method: "POST",
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				"id_group": id_group,
				"id_user": id,
				"id_owner": user.id
			}),
		});
		
		if (res.ok)
		{
			const data = await res.json();
			console.log(data);

			getMembers();
		}
	}

	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
		<h1> {`${t("groups:member-list")}`}</h1>
		<Button
			variant="contained"
			color="primary"
			onClick={handleClick}
		>
			{`${t("groups:add-user")}`}
		</Button>
		<AddMemberDialog onClose={handleClose} open={open} title={`${t("common:add-user")}`} addMember={addMember}/>
		<List className={classes.root}>
			{members.map((row) => (
				<div key={row.id_user}>
					<ListItem button>
						<ListItemText 
							primary={ row.username }
							secondary={ row.email }
						/>
						<ListItemSecondaryAction>
							<Tooltip title={`${t("groups:delete-button")}`}>
								<IconButton edge="end" onClick={async () => {await deleteMember(row.id_user)} }>
									<DeleteIcon color="primary"/>
								</IconButton>
							</Tooltip>
						</ListItemSecondaryAction>
					</ListItem>
					<Divider variant="middle" component="li" light/>
				</div>
			))}
		</List>
		</>
	);
}

export default MemberList;
