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
	content: {
		paddingBottom: "0",
		paddingLeft: "0.5rem",
		paddingRight: "0.5rem",
	},
	padding: {
		paddingBottom: "1rem",
		paddingTop: "1rem",
	},
}));

function FriendDialog({ onClose, open, title = null }) {
	const { t } = useTranslation();

	const [friends, setFriends] = useState([]);

	const { accessToken } = useContext(UserContext);

	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const getFriends = async () => {
		const res = await fetch(`${host}/friends`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});
		if (res.ok) {
			const friends = await res.json();
			setFriends(friends);
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
			getFriends();
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
				{title || t("add-friend")}
				<Tooltip title={t("cancel")}>
					<IconButton
						className={classes.closeButton}
						onClick={() => handleClose(null)}
					>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			</DialogTitle>
			<DialogContent className={classes.content}>
				<List>
					{friends.length > 0 ? (
						friends.map((friend) => (
							<ListItem
								button
								className={friend.email ? "" : classes.padding}
								key={friend.id}
								onClick={() => handleClose(friend)}
							>
								<ListItemAvatar>
									<Avatar user={friend} />
								</ListItemAvatar>
								<ListItemText
									primary={friend.username}
									primaryTypographyProps={{ noWrap: true }}
									secondary={friend.email}
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

export default FriendDialog;
