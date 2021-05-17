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
import GroupDeletionDialog from '../group/groupDeletion';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 600,
		backgroundColor: theme.palette.background.paper,
	},
  }));

const GroupList = ({groups, refreshGroupList}) => {
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

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
		<List className={classes.root}>
			{groups.map((row) => (
				<>
					<ListItem key={row.id_group} button component={Link} underline="none" color="inherit" href="/group/[id]" as={`/group/${row.id_group}`}>
						<ListItemText 
							primary={ row.name }
							secondary={ row.description }
						/>
						<ListItemSecondaryAction>
							<Tooltip title={`${t("groups:settings-button")}`}>
								<IconButton edge="end" key={row.id_group}>
									<SettingsIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title={`${t("groups:delete-button")}`}>
								<IconButton edge="end" onClick={handleClick(row.name, row.id_group)} key={row.id_group}>
									<DeleteIcon />
								</IconButton>
							</Tooltip>
						</ListItemSecondaryAction>
					</ListItem>
					<Divider variant="middle" component="li" light/>
				</>
			))}
		</List>
		<GroupDeletionDialog onClose={handleClose} open={open} title={`Delete Group: ${groupName}`} groupId={groupId} refreshGroupList={refreshGroupList}/>
		</>
	);
}

export default GroupList;
