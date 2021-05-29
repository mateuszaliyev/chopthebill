// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Material UI
import { Paper, IconButton, Menu, MenuItem } from "@material-ui/core/";
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
	large: {
		fontSize: "5rem",
		height: theme.spacing(20),
		width: theme.spacing(20),
	},
	root: {
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		padding: theme.spacing(3),
		gap: theme.spacing(3),
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
	},
	details: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
	},
	margin: {
		margin: "0",
	},
}));

function Profile({ user }) {
	const { t } = useTranslation("common");
	const router = useRouter();

	const { user: loggedUser, accessToken } = useContext(UserContext);

	const classes = useStyles();

	const lastSeen = useDateComparison(new Date(user.lastSeen), new Date());

	const [avatarAnchor, setAvatarAnchor] = useState(null);

	const handleClick = (e) => {
		setAvatarAnchor(e.currentTarget);
	};

	const handleClose = () => {
		setAvatarAnchor(null);
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

	return (
		<Paper className={classes.root}>
			{user.id === loggedUser.id ? (
				<IconButton onClick={handleClick}>
					<Avatar className={classes.large} user={user} />
				</IconButton>
			) : (
				<Avatar className={classes.large} user={user} />
			)}
			<Menu
				anchorEl={avatarAnchor}
				keepMounted
				open={Boolean(avatarAnchor)}
				onClose={handleClose}
			>
				<input
					type="file"
					name="image"
					accept="image/*"
					id="upload"
					multiple={false}
					onChange={handleModify}
					style={{ display: "none" }}
				></input>
				<label htmlFor="upload">
					<MenuItem>{t("change")}</MenuItem>
				</label>
				<MenuItem onClick={handleDelete}>{t("delete")}</MenuItem>
			</Menu>

			<div className={classes.details}>
				<h1 className={classes.margin}>{user.username}</h1>
				{!user.hideEmail && user.username !== user.email && (
					<h3 className={classes.margin}>{user.email}</h3>
				)}
				<h3 className={classes.margin}>{lastSeen}</h3>
			</div>
			{loggedUser.id !== user.id &&
				(user.friend ? (
					<UnfriendButton color="error" id={user.id} username={user.username} />
				) : (
					<AddFriendButton color="primary" id={user.id} />
				))}
		</Paper>
	);
}
export default Profile;
