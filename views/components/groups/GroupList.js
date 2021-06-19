// React & Next
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Avatar as MuiAvatar,
	Fab,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	makeStyles,
	Snackbar,
	Tooltip,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import GroupAddIcon from "@material-ui/icons/GroupAdd";

// Components
import Avatar from "../Avatar";
import Empty from "../Empty";
import GroupDeleteDialog from "./GroupDeleteDialog";
import GroupDialog from "./GroupDialog";
import Link from "../Link";

// Contexts
import { UserContext } from "../auth/User";

// Hooks
import useWindowSize from "../hooks/useWindowSize";

// Lodash
import cloneDeep from "lodash/cloneDeep";

// Styles
const useStyles = makeStyles((theme) => ({
	absolute: {
		bottom: theme.spacing(2),
		position: "absolute",
		right: theme.spacing(2),
	},
	buttons: {
		display: "flex",
		flexWrap: "nowrap",
	},
	item: {
		alignItems: "center",
		display: "flex",
		justifyContent: "space-between",
		paddingRight: "7rem",
	},
	padding: {
		paddingBottom: "1rem",
		paddingTop: "1rem",
	},
	red: {
		color: theme.palette.error.main,
		"&:hover": {
			backgroundColor: `${theme.palette.error.main}${parseInt(
				255 * theme.palette.action.hoverOpacity
			)
				.toString(16)
				.padStart(2, "0")}`,
		},
	},
}));

const GroupList = ({ groups, setGroups }) => {
	const { t } = useTranslation();

	const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
	const [editGroupDialogOpen, setEditGroupDialogOpen] = useState(
		new Array(groups.length).fill(false)
	);
	const [groupDeleteDialogGroup, setGroupDeleteDialogGroup] = useState(null);
	const [groupDeleteDialogOpen, setGroupDeleteDialogOpen] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");
	const [snackbarText, setSnackbarText] = useState(null);

	const { user } = useContext(UserContext);

	const classes = useStyles();
	const { width } = useWindowSize();

	const handleCreateGroupDialogClose = (data) => {
		setCreateGroupDialogOpen(false);
		if (data.group) {
			setGroups((prevGroups) =>
				[...prevGroups, data.group].sort((a, b) => (a.name < b.name ? -1 : 1))
			);
		}
		setSnackbarSeverity(data.response || "info");
		setSnackbarText(
			data.response === "success"
				? t("groups:group-created-successfully")
				: data.response === "error"
				? `${t("something-went-wrong")}. ${t("try-again")}.`
				: null
		);
	};

	const handleGroupDeleteDialogClose = (response) => {
		if (response === "success") {
			setGroups((prevGroups) => {
				return [...prevGroups].filter(
					(group) => group.id !== groupDeleteDialogGroup.id
				);
			});
		}

		setTimeout(() => setGroupDeleteDialogGroup(null), 500);
		setGroupDeleteDialogOpen(false);

		setSnackbarSeverity(response || "info");
		setSnackbarText(
			response === "success"
				? t("groups:group-deleted-successfully")
				: response === "error"
				? `${t("something-went-wrong")}. ${t("try-again")}.`
				: null
		);
	};

	const handleGroupDeleteDialogOpen = (index) => {
		setGroupDeleteDialogGroup(groups[index]);
		setGroupDeleteDialogOpen(true);
	};

	const handleEditGroupDialogClose = (index, data) => {
		setEditGroupDialogOpen((prevEditGroupDialogOpen) => {
			const newEditGroupDialogOpen = [...prevEditGroupDialogOpen];
			newEditGroupDialogOpen[index] = false;
			return newEditGroupDialogOpen;
		});
		if (data.group) {
			setGroups((prevGroups) => {
				const newGroups = [...prevGroups];
				newGroups[index] = data.group;
				return newGroups;
			});
		}
		setSnackbarSeverity(data.response || "info");
		setSnackbarText(
			data.response === "success"
				? t("groups:group-modified-successfully")
				: data.response === "error"
				? `${t("something-went-wrong")}. ${t("try-again")}.`
				: null
		);
	};

	const handleEditGroupDialogOpen = (index) => {
		setEditGroupDialogOpen((prevEditGroupDialogOpen) => {
			const newEditGroupDialogOpen = [...prevEditGroupDialogOpen];
			newEditGroupDialogOpen[index] = true;
			return newEditGroupDialogOpen;
		});
	};

	return (
		<>
			{groups.length === 0 ? (
				<Empty size="4rem" />
			) : (
				<>
					<List dense={width <= 480}>
						{groups.map((group, index) => (
							<div key={group.id}>
								<ListItem
									button
									color="inherit"
									className={`${classes.item} ${
										group.description ? "" : classes.padding
									}`}
									component={Link}
									href={`/group/${group.id}`}
									underline="none"
								>
									<ListItemAvatar>
										<Avatar alt={group.name} />
									</ListItemAvatar>
									<ListItemText
										primary={group.name}
										primaryTypographyProps={{ noWrap: true }}
										secondary={group.description}
										secondaryTypographyProps={{ noWrap: true }}
									/>
									{group.members.some(
										(member) => member.id === user.id && member.owner
									) && (
										<ListItemSecondaryAction className={classes.buttons}>
											<Tooltip title={`${t("edit")}`}>
												<IconButton
													onClick={() => handleEditGroupDialogOpen(index)}
												>
													<EditIcon />
												</IconButton>
											</Tooltip>
											<Tooltip title={`${t("delete")}`}>
												<IconButton
													className={classes.red}
													onClick={() => handleGroupDeleteDialogOpen(index)}
												>
													<DeleteForeverIcon />
												</IconButton>
											</Tooltip>
										</ListItemSecondaryAction>
									)}
								</ListItem>
								<GroupDialog
									edit={cloneDeep(group)}
									onClose={(data) => handleEditGroupDialogClose(index, data)}
									open={editGroupDialogOpen[index]}
								/>
							</div>
						))}
						<ListItem
							button
							className={classes.padding}
							onClick={() => setCreateGroupDialogOpen(true)}
						>
							<ListItemAvatar>
								<MuiAvatar>
									<GroupAddIcon />
								</MuiAvatar>
							</ListItemAvatar>
							<ListItemText
								primary={t("groups:new-group")}
								primaryTypographyProps={{ noWrap: true }}
							/>
						</ListItem>
					</List>
				</>
			)}
			<GroupDeleteDialog
				group={groupDeleteDialogGroup}
				onClose={handleGroupDeleteDialogClose}
				open={groupDeleteDialogOpen}
			/>
			<GroupDialog
				onClose={handleCreateGroupDialogClose}
				open={createGroupDialogOpen}
			/>
			<Snackbar
				autoHideDuration={6000}
				onClose={() => setSnackbarText(null)}
				open={Boolean(snackbarText)}
			>
				<Alert
					elevation={6}
					onClose={() => setSnackbarText(null)}
					severity={snackbarSeverity}
					variant="filled"
				>
					{snackbarText}
				</Alert>
			</Snackbar>
			<Tooltip title={`${t("groups:new-group")}`}>
				<Fab
					className={classes.absolute}
					color="primary"
					onClick={() => setCreateGroupDialogOpen(true)}
				>
					<GroupAddIcon />
				</Fab>
			</Tooltip>
		</>
	);
};

export default GroupList;
