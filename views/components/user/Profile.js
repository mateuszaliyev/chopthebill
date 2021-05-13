// React & Next
import { useContext } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Material UI
import { Button, Paper } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

// Components
import Avatar from "../Avatar";

// Contexts
import { UserContext } from "../../components/auth/User";

// Hooks
import useDateComparison from "../hooks/useDateComparison";

import { host } from "../../config";

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
	const { t } = useTranslation(["common", "date"]);

	const { user: loggedUser, accessToken } = useContext(UserContext);

	const classes = useStyles();

	const lastSeen = useDateComparison(new Date(user.lastSeen), new Date());

	const router = useRouter();

	const handleClick = async () => {
		const res = await fetch(`${host}/friend`, {
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
			router.reload();
		}
	};

	return (
		<Paper className={classes.root}>
			<Avatar alt={user.username} className={classes.large} />
			<div className={classes.details}>
				<h1 className={classes.margin}>{user.username}</h1>
				{!user.hideEmail && user.username !== user.email && (
					<h3 className={classes.margin}>{user.email}</h3>
				)}
				<h3 className={classes.margin}>{lastSeen}</h3>
			</div>
			{loggedUser.id !== user.id &&
				(user.friend ? (
					<Button onClick={handleClick} variant="contained" color="secondary">
						{t("unfriend")}
					</Button>
				) : (
					<Button onClick={handleClick} variant="contained" color="primary">
						{t("add-friend")}
					</Button>
				))}
		</Paper>
	);
}
export default Profile;
