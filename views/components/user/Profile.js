// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Material UI
import {
	IconButton,
	Menu,
	MenuItem,
	Paper,
	Typography,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

// Components
import AddFriendButton from "../friends/AddFriendButton";
import Avatar from "../Avatar";
import UnfriendButton from "../friends/UnfriendButton";

// Contexts
import { UserContext } from "../../components/auth/User";

// Config
import { host } from "../../config";

// Hooks
import useDateComparison from "../hooks/useDateComparison";

// Styles
const useStyles = makeStyles((theme) => ({
	avatar: {
		fontSize: "5rem",
		height: "10rem",
		width: "10rem",
	},
	details: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
	},
	margin: {
		margin: "0",
	},
	root: {
		alignItems: "center",
		display: "flex",
		gap: theme.spacing(3),
		flexWrap: "wrap",
		justifyContent: "center",
		marginBottom: theme.spacing(3),
		marginTop: theme.spacing(3),
		padding: theme.spacing(3),
	},
}));

function Profile({ setUser, user }) {
	const { t } = useTranslation("common");

	const [avatarAnchor, setAvatarAnchor] = useState(null);

	const { user: loggedUser, accessToken } = useContext(UserContext);

	const classes = useStyles();
	const lastSeen = useDateComparison(new Date(user.lastSeen), new Date());
	const router = useRouter();

	const handleClick = (e) => {
		setAvatarAnchor(e.currentTarget);
	};

	const handleClose = () => {
		setAvatarAnchor(null);
	};

	const handleDelete = async () => {
		handleClose();
		const res = await fetch(`${host}/avatars/delete`, {
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});
		if (res.ok) router.reload();
	};

	const handleModify = async (e) => {
		handleClose();

		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("image", file);

		await fetch(`${host}/avatars/new`, {
			method: "POST",
			body: formData,
			headers: {
				Accept: "multipart/form-data",
				Authorization: `Bearer ${accessToken}`,
			},
		});
		router.reload();
	};

	const onAddFriend = () => {
		setUser((prevUser) => ({ ...prevUser, friend: true }));
	};

	const onUnfriend = (id) => {
		setUser((prevUser) => ({ ...prevUser, friend: false }));
	};

	return (
		<Paper className={classes.root}>
			{user.id === loggedUser.id ? (
				<IconButton onClick={handleClick}>
					<Avatar className={classes.avatar} user={user} />
				</IconButton>
			) : (
				<Avatar className={classes.avatar} user={user} />
			)}
			<Menu
				anchorEl={avatarAnchor}
				keepMounted
				open={Boolean(avatarAnchor)}
				onClose={handleClose}
			>
				<input
					accept="image/*"
					id="upload"
					multiple={false}
					name="image"
					onChange={handleModify}
					style={{ display: "none" }}
					type="file"
				></input>
				<label htmlFor="upload">
					<MenuItem>{t(user.avatar ? "change" : "add")}</MenuItem>
				</label>
				{user.avatar && (
					<MenuItem onClick={handleDelete}>{t("delete")}</MenuItem>
				)}
			</Menu>

			<div className={classes.details}>
				<Typography className={classes.margin} variant="h4">
					{user.username}
				</Typography>
				{!user.hideEmail && user.username !== user.email && (
					<Typography className={classes.margin}>{user.email}</Typography>
				)}
				<Typography className={classes.margin}>{lastSeen}</Typography>
			</div>
			{loggedUser.id !== user.id &&
				(user.friend ? (
					<UnfriendButton
						color="error"
						id={user.id}
						onUnfriend={onUnfriend}
						username={user.username}
					/>
				) : (
					<AddFriendButton
						color="primary"
						id={user.id}
						onAddFriend={onAddFriend}
					/>
				))}
		</Paper>
	);
}
export default Profile;
