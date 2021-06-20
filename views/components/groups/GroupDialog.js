// React & Next
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Avatar as MuiAvatar,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	ListSubheader,
	makeStyles,
	TextField,
	Tooltip,
	useMediaQuery,
	useTheme,
} from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DescriptionIcon from "@material-ui/icons/Description";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import RemoveIcon from "@material-ui/icons/Remove";
import StarIcon from "@material-ui/icons/Star";
import TextFieldsIcon from "@material-ui/icons/TextFields";

// Components
import Avatar from "../Avatar";
import DiscardChanges from "../DiscardChanges";
import FriendDialog from "../friends/FriendDialog";
import SearchDialog from "../layout/SearchDialog";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../auth/User";

// Hooks
import useWindowSize from "../hooks/useWindowSize";

// Styles
const useStyles = makeStyles((theme) => ({
	addButton: {
		paddingLeft: "2.5rem",
	},
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
	},
	content: ({ bpxl }) => ({
		paddingLeft: bpxl ? "1.5rem" : "1rem",
		paddingRight: bpxl ? "1.5rem" : "1rem",
	}),
	form: {
		display: "flex",
		flexDirection: "column",
		gap: "1rem",
	},
	inputField: {
		flexGrow: "1",
	},
	item: {
		alignItems: "flex-end",
		display: "flex",
		gap: "1rem",
		"& > svg": {
			marginBottom: "0.25rem",
		},
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

function GroupDialog({ edit = null, onClose, open }) {
	const { t } = useTranslation();

	const [changesMade, setChangesMade] = useState(false);
	const [discardOpen, setDiscardOpen] = useState(false);
	const [friendDialogOpen, setFriendDialogOpen] = useState(false);
	const [group, setGroup] = useState({
		description: "",
		id: null,
		members: [],
		name: "",
	});
	const [helperText, setHelperText] = useState({
		description: null,
		name: null,
	});
	const [searchDialogOpen, setSearchDialogOpen] = useState(false);

	const { accessToken, user } = useContext(UserContext);

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const { width } = useWindowSize();
	const bpxl = width >= 480;

	const classes = useStyles({ bpxl });

	const handleClose = (returnValue) => {
		onClose(returnValue);
		setChangesMade(false);
		setTimeout(
			() =>
				setGroup({
					description: "",
					id: null,
					members: [],
					name: "",
				}),
			500
		);
	};

	const handleDialogClose = (member) => {
		if (member) {
			let exists = false;

			for (const m of group.members) {
				if (member.id === m.id) {
					exists = true;
					break;
				}
			}

			if (!exists) {
				setGroup((prevGroup) => ({
					...prevGroup,
					members: [
						...prevGroup.members,
						{
							avatar: member.avatar,
							email: member.hideEmail ? "" : member.email,
							id: member.id,
							owner: false,
							username: member.username,
						},
					],
				}));
			}
		}
		setChangesMade(true);
		setFriendDialogOpen(false);
		setSearchDialogOpen(false);
	};

	const handleDiscard = (value) => {
		setDiscardOpen(false);
		if (value) {
			handleClose({ group: null, response: null });
		}
	};

	const handleDiscardOpen = () => {
		if (changesMade) {
			setDiscardOpen(true);
		} else {
			handleClose({ group: null, response: null });
		}
	};

	const handleInput = (e, key) => {
		setChangesMade(true);

		setGroup((prevGroup) => ({
			...prevGroup,
			[key]: e.target.value,
		}));
	};

	const handleOwnership = (memberIndex) => {
		if (memberIndex === 0 || group.members[memberIndex].id === user.id) {
			return;
		}

		setChangesMade(true);

		setGroup((prevGroup) => {
			const newMembers = [...prevGroup.members];
			newMembers[memberIndex].owner = !newMembers[memberIndex].owner;
			return {
				...prevGroup,
				members: newMembers,
			};
		});
	};

	const handleRemove = (memberIndex) => {
		if (memberIndex === 0 || group.members[memberIndex].id === user.id) {
			return;
		}

		setChangesMade(true);

		setGroup((prevGroup) => {
			const newMembers = prevGroup.members.filter(
				(member, index) => memberIndex !== index
			);
			return {
				...prevGroup,
				members: newMembers,
			};
		});
	};

	const handleSubmit = async () => {
		setHelperText({
			description: null,
			name: null,
		});

		if (!changesMade) {
			return handleClose({
				group: null,
				response: null,
			});
		}

		const res = await fetch(`${host}/groups`, {
			method: edit ? "PUT" : "POST",
			credentials: "include",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(group),
		});

		if (res.ok) {
			const { id } = await res.json();
			handleClose({
				group: { ...group, id },
				response: "success",
			});
		} else {
			if (res.status === 403 || res.status >= 500) {
				handleClose({
					group: null,
					response: "error",
				});
			} else {
				const error = await res.json();
				error.forEach((err) => {
					const key = err.split("-")[0];
					setHelperText((prevHelperText) => ({
						...prevHelperText,
						[key]: t(`groups:${err}`),
					}));
				});
			}
		}
	};

	useEffect(() => {
		if (open && edit) {
			setGroup(edit);
		} else if (open && group.members.length === 0) {
			setGroup({
				id: null,
				description: "",
				members: [
					{
						avatar: user.avatar,
						email: user.hideEmail ? "" : user.email,
						id: user.id,
						owner: true,
						username: user.username,
					},
				],
				name: "",
			});
		} else if (open) {
			setGroup({
				description: "",
				id: null,
				members: [],
				name: "",
			});
		}
	}, [open, user]);

	return (
		<Dialog
			fullScreen={fullScreen}
			fullWidth={true}
			onClose={handleDiscardOpen}
			open={Boolean(open)}
		>
			<DialogTitle>
				{edit ? t("groups:group-settings") : t("groups:new-group")}
				<Tooltip title={t("cancel")}>
					<IconButton
						className={classes.closeButton}
						onClick={handleDiscardOpen}
					>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			</DialogTitle>
			<DialogContent className={classes.content}>
				<form className={classes.form}>
					<div className={classes.item}>
						<TextFieldsIcon />
						<TextField
							className={classes.inputField}
							error={Boolean(helperText.name)}
							helperText={helperText.name}
							label={t("name")}
							onChange={(e) => handleInput(e, "name")}
							required
							value={group.name}
						/>
					</div>
					<div className={classes.item}>
						<DescriptionIcon />
						<TextField
							className={classes.inputField}
							error={Boolean(helperText.description)}
							helperText={helperText.description}
							label={t("description")}
							onChange={(e) => handleInput(e, "description")}
							value={group.description}
						/>
					</div>
				</form>
				<List dense={!bpxl}>
					<ListSubheader disableGutters disableSticky>
						{t("groups:members")}
					</ListSubheader>
					{group.members.length > 0 &&
						group.members.map((member, index) => (
							<ListItem
								className={bpxl && member.email ? "" : classes.padding}
								key={member.id}
								style={{ paddingLeft: "0" }}
							>
								<ListItemIcon style={{ minWidth: "2.5rem" }}>
									<Tooltip title={t("groups:group-owner")}>
										<IconButton
											edge="start"
											onClick={() => handleOwnership(index)}
											size="small"
											style={{ color: member.owner && amber[500] }}
										>
											<StarIcon color={member.owner ? "inherit" : "disabled"} />
										</IconButton>
									</Tooltip>
								</ListItemIcon>
								<ListItemAvatar>
									<Avatar user={member} />
								</ListItemAvatar>
								<ListItemText
									primary={member.username}
									secondary={bpxl && member.email}
								/>
								<ListItemSecondaryAction>
									<Tooltip title={t("remove")}>
										<IconButton
											className={classes.red}
											edge="end"
											onClick={() => handleRemove(index)}
											size="small"
										>
											<RemoveIcon />
										</IconButton>
									</Tooltip>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					<ListItem
						button
						className={`${classes.addButton} ${classes.padding}`}
						onClick={() => setSearchDialogOpen(true)}
					>
						<ListItemAvatar>
							<MuiAvatar>
								<AddIcon />
							</MuiAvatar>
						</ListItemAvatar>
						<ListItemText primary={t("add-user")} />
					</ListItem>
					<ListItem
						button
						className={`${classes.addButton} ${classes.padding}`}
						onClick={() => setFriendDialogOpen(true)}
					>
						<ListItemAvatar>
							<MuiAvatar>
								<PersonAddIcon />
							</MuiAvatar>
						</ListItemAvatar>
						<ListItemText primary={t("add-friend")} />
					</ListItem>
				</List>
			</DialogContent>
			<DialogActions>
				<Button className={classes.red} onClick={handleDiscardOpen}>
					{t("cancel")}
				</Button>
				<Button color="primary" onClick={handleSubmit}>
					{t(edit ? "save" : "groups:create-group")}
				</Button>
			</DialogActions>
			<DiscardChanges
				onClose={handleDiscard}
				open={discardOpen}
			></DiscardChanges>
			<FriendDialog onClose={handleDialogClose} open={friendDialogOpen} />
			<SearchDialog
				closeButtonTooltip={t("cancel")}
				onClose={handleDialogClose}
				open={searchDialogOpen}
				placeholder={t("search-users")}
				title={t("add-user")}
				users
			/>
		</Dialog>
	);
}

export default GroupDialog;
