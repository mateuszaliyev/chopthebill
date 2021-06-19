// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Avatar as MuiAvatar,
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
import AddIcon from "@material-ui/icons/Add";

// Components
import Avatar from "../Avatar";
import Link from "../Link";
import SearchDialog from "../layout/SearchDialog";
import UnfriendButton from "./UnfriendButton";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../auth/User";

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
	const { t } = useTranslation();

	const [searchDialogOpen, setSearchDialogOpen] = useState(false);

	const { accessToken, user: loggedUser } = useContext(UserContext);

	const classes = useStyles();
	const theme = useTheme();
	const bpsm = useMediaQuery(theme.breakpoints.up("sm"));

	const addFriend = async (user) => {
		const res = await fetch(`${host}/friends`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				id: user.id,
			}),
		});
		if (res.ok) {
			setFriends((prevFriends) =>
				[...prevFriends, user].sort(
					(a, b) => new Date(b.lastSeen) - new Date(a.lastSeen)
				)
			);
		}
	};

	const handleSearchDialogClose = (user) => {
		if (user && user.id !== loggedUser.id) {
			let includes = friends.filter((friend) => friend.id === user.id);
			if (includes.length === 0) {
				addFriend(user);
			}
		}
		setSearchDialogOpen(false);
	};

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
			<ListItem
				button
				className={classes.padding}
				onClick={() => setSearchDialogOpen(true)}
			>
				<ListItemAvatar>
					<MuiAvatar>
						<AddIcon />
					</MuiAvatar>
				</ListItemAvatar>
				<ListItemText>{t("friends:add-friend")}</ListItemText>
			</ListItem>
			<SearchDialog
				closeButtonTooltip={t("cancel")}
				onClose={handleSearchDialogClose}
				open={searchDialogOpen}
				placeholder={t("search-users")}
				title={t("friends:add-friend")}
				users
			/>
		</List>
	);
}

export default FriendList;
