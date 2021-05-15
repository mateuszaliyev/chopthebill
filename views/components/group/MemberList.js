// React & Next
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

// Components
import Link from "../Link";

import { makeStyles } from '@material-ui/core/styles';
// Material UI
import {
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Divider,
	Tooltip,
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 600,
		backgroundColor: theme.palette.background.paper,
	},
  }));

const MemberList = ({members}) => {
	const { t } = useTranslation(["common", "groups"]);
	const classes = useStyles();

	const [open, setOpen] = useState();
	const [groupName, setGroupName] = useState();
	const [groupId, setGroupId] = useState();

	const handleClick = (name, id) => {
		return () => {
			setOpen((prevOpen) => !prevOpen);
			setGroupName(name);
			setGroupId(id);
		}
	};

	return (
		<>
		<h1>Lista członków: </h1>
		<List className={classes.root}>
			{members.map((row) => (
				<>
					<ListItem key={row.id_user} button >
						<ListItemText 
							primary={ row.username }
							secondary={ row.email }
						/>
						<ListItemSecondaryAction>
							<Tooltip title={`${t("groups:delete-button")}`}>
								<IconButton edge="end" key={row.id_user}>
									<DeleteIcon />
								</IconButton>
							</Tooltip>
						</ListItemSecondaryAction>
					</ListItem>
					<Divider variant="middle" component="li" light/>
				</>
			))}
		</List>
		</>
	);
}

export default MemberList;
