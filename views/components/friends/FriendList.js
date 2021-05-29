// React & Next
import { useTranslation } from "next-i18next";

// Material UI
import {
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	Tooltip,
	Typography,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// Components
import Avatar from "../Avatar";
import Link from "../Link";
import UnfriendButton from "./UnfriendButton";

// Hooks
import useDateComparison from "../hooks/useDateComparison";

// Styles
const useStyles = makeStyles((theme) => ({
	lastSeen: {
		marginRight: "1rem",
		textAlign: "right",
		maxWidth: "18ch",
	},
	left: {
		marginLeft: "3.5rem",
	},
	link: {
		alignItems: "center",
		display: "flex",
		flexGrow: "1",
		justifyContent: "space-between",
	},
	listItem: {
		justifyContent: "space-between",
	},
	padding: {
		paddingBottom: "1rem",
		paddingTop: "1rem",
	},
	right: {
		marginRight: "3rem",
		textAlign: "right",
	},
	subheader: {
		...theme.typography.subtitle2,
		color: theme.palette.text.secondary,
		display: "inline-block",
		width: "calc(100% / 3)",
	},
}));

function FriendListLastSeen({ className, friend, listItem = false }) {
	const lastSeen = useDateComparison(new Date(friend.lastSeen), new Date());
	return listItem ? (
		<ListItemText className={className}>
			<Tooltip title={new Date(friend.lastSeen).toString()}>
				<Typography>{lastSeen}</Typography>
			</Tooltip>
		</ListItemText>
	) : (
		<>{lastSeen}</>
	);
}

function FriendList({ friends, setFriends }) {
	const { t } = useTranslation(["common", "friends"]);

	const classes = useStyles();
	const theme = useTheme();
	const bpsm = useMediaQuery(theme.breakpoints.up("sm"));

	const onUnfriend = (id) => {
		setFriends((prevFriends) =>
			prevFriends.filter((friend) => friend.id !== id)
		);
	};

	return (
		<List>
			<ListItem className={classes.listItem}>
				<Typography className={`${classes.left} ${classes.subheader}`}>
					{t("user")}
				</Typography>
				{bpsm && (
					<Typography className={`${classes.right} ${classes.subheader}`}>
						{t("last-seen")}
					</Typography>
				)}
			</ListItem>
			{friends.map((friend) => (
				<ListItem
					button
					className={`${friend.email ? "" : classes.padding}`}
					key={friend.id}
				>
					<Link
						className={classes.link}
						color="inherit"
						href={`/user/${friend.id}`}
						underline="none"
					>
						<ListItemAvatar>
							<Avatar user={friend} />
						</ListItemAvatar>
						<ListItemText
							primary={friend.username}
							primaryTypographyProps={{ noWrap: true }}
							secondary={
								bpsm ? friend.email : <FriendListLastSeen friend={friend} />
							}
							secondaryTypographyProps={{ noWrap: true }}
						/>
						{bpsm && (
							<FriendListLastSeen
								className={classes.lastSeen}
								friend={friend}
								listItem
							/>
						)}
					</Link>
					<ListItemSecondaryAction>
						<UnfriendButton
							color="error"
							edge="end"
							id={friend.id}
							onUnfriend={onUnfriend}
							username={friend.username}
						/>
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);
}

export default FriendList;
