import Avatar from "../Avatar";

import Paper from "@material-ui/core/Paper";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import { useTranslation } from "next-i18next";

import { useContext } from "react";
import { UserContext } from "../../components/auth/User";

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
	const classes = useStyles();

	const { t } = useTranslation("common");

	const { user: loggedUser } = useContext(UserContext);

	return (
		<Paper className={classes.root}>
			<Avatar alt={user.username} className={classes.large} />
			<div className={classes.details}>
				<h1 className={classes.margin}>{user.username}</h1>
				{!user.hideEmail && <h3 className={classes.margin}>{user.email}</h3>}
				<h3 className={classes.margin}>{user.lastSeen}</h3>
			</div>
			{loggedUser.id !== user.id && (
				<Button variant="contained" color="primary">
					{t("add-friend")}
				</Button>
			)}
		</Paper>
	);
}
export default Profile;
