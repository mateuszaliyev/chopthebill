// React & Next
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	makeStyles,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

// Components
import Avatar from "../Avatar";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../auth/User";

// Styles
const useStyles = makeStyles((theme) => ({
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
	},
	padding: {
		paddingBottom: "1rem",
		paddingTop: "1rem",
	},
}));

function MemberDialog({ groupId, onClose, open, title = null }) {
	const { t } = useTranslation();

	const [members, setMembers] = useState([]);

	const { accessToken } = useContext(UserContext);

	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const getMembers = async () => {
		const res = await fetch(`${host}/groups/${groupId}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});
		if (res.ok) {
			const group = await res.json();
			setMembers(group.members);
		}
	};

	const handleClose = (returnValue) => {
		if (returnValue && returnValue !== {}) {
			onClose(returnValue);
		} else {
			onClose(null);
		}
	};

	useEffect(() => {
		if (accessToken && open) {
			getMembers();
		}
	}, [open]);

	return (
		<Dialog
			fullScreen={fullScreen}
			fullWidth={true}
			onClose={() => handleClose(null)}
			open={open}
		>
			<DialogTitle>
				{title || t("groups:add-member")}
				<Tooltip title={t("cancel")}>
					<IconButton
						className={classes.closeButton}
						onClick={() => handleClose(null)}
					>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			</DialogTitle>
			<DialogContent style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
				<List>
					{members.length > 0 ? (
						members.map((member) => (
							<ListItem
								button
								className={`${classes.listItem} ${
									member.email ? "" : classes.padding
								}`}
								key={member.id}
								onClick={() => handleClose(member)}
							>
								<ListItemAvatar>
									<Avatar user={member} />
								</ListItemAvatar>
								<ListItemText
									primary={member.username}
									primaryTypographyProps={{ noWrap: true }}
									secondary={member.email}
									secondaryTypographyProps={{ noWrap: true }}
								></ListItemText>
							</ListItem>
						))
					) : (
						<List>
							<ListItem>
								<ListItemText>
									<Typography color="error">{t("no-results")}</Typography>
								</ListItemText>
							</ListItem>
						</List>
					)}
				</List>
			</DialogContent>
		</Dialog>
	);
}

export default MemberDialog;
