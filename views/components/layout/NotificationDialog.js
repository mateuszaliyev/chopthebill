// React & Next
import { useContext } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	ListSubheader,
	makeStyles,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import NotificationsOffIcon from "@material-ui/icons/NotificationsOff";

// Components
import Link from "../Link";

// Config
import { host } from "../../config";

// Contexts
import { NotificationsContext } from "./Notifications";
import { UserContext } from "../auth/User";

// Styles
const useStyles = makeStyles((theme) => ({
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
	},
	empty: ({ bpsm }) => ({
		alignItems: "center",
		color: theme.palette.action.disabled,
		display: "flex",
		gap: "1rem",
		flexDirection: bpsm ? "row" : "column",
		height: bpsm ? "" : "100%",
		justifyContent: "center",
		margin: "1rem",
	}),
}));

function Notification({
	disabled = false,
	divider,
	notification,
	onRead = null,
}) {
	const { t } = useTranslation();

	return (
		<ListItem
			button={Boolean(notification.redirect)}
			disabled={disabled}
			divider={divider}
		>
			<Link color="inherit" href={notification.redirect} underline="none">
				<ListItemText
					primary={notification.title}
					secondary={notification.description}
				/>
			</Link>
			{!disabled && (
				<ListItemSecondaryAction>
					<Tooltip title={t("mark-as-read")}>
						<IconButton
							color="primary"
							edge="end"
							onClick={() => onRead(notification.id)}
						>
							<DoneIcon />
						</IconButton>
					</Tooltip>
				</ListItemSecondaryAction>
			)}
		</ListItem>
	);
}

function NotificationDialog({ onClose, open, title }) {
	const { t } = useTranslation();

	const { notifications, setNotifications } = useContext(NotificationsContext);
	const { accessToken } = useContext(UserContext);

	const theme = useTheme();
	const bpsm = useMediaQuery(theme.breakpoints.up("sm"));
	const classes = useStyles({ bpsm });

	const unread = notifications.filter((notification) => !notification.read);
	const read = notifications.filter((notification) => notification.read);

	const handleRead = async (id) => {
		const res = await fetch(`${host}/notifications/${id}`, {
			method: "DELETE",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			setNotifications((prevNotifications) => {
				const newNotifications = [...prevNotifications];
				const index = newNotifications.findIndex(
					(notification) => id === notification.id
				);
				newNotifications[index].read = true;
				return newNotifications;
			});
		}
	};

	return (
		<Dialog fullScreen={!bpsm} fullWidth={true} onClose={onClose} open={open}>
			<DialogTitle>
				{title}
				<Tooltip title={t("close")}>
					<IconButton className={classes.closeButton} onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			</DialogTitle>
			<DialogContent>
				{notifications.length > 0 ? (
					<List>
						{unread.length > 0 && (
							<ListSubheader disableSticky>
								{t("new")} ({unread.length})
							</ListSubheader>
						)}
						{unread.map((notification, index) => (
							<Notification
								divider={index !== unread.length - 1}
								key={index}
								notification={notification}
								onRead={handleRead}
							/>
						))}
						{read.length > 0 && (
							<ListSubheader disableSticky>
								{t("read")} ({read.length})
							</ListSubheader>
						)}
						{read.map((notification, index) => (
							<Notification
								disabled
								divider={index !== read.length - 1}
								key={index}
								notification={notification}
								onRead={handleRead}
							/>
						))}
					</List>
				) : (
					<div className={classes.empty}>
						<NotificationsOffIcon style={{ fontSize: "4rem" }} />
						<Typography variant="h6">{t("no-notifications")}</Typography>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default NotificationDialog;
