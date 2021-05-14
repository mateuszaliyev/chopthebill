// React & Next
import { useContext } from "react";

// Material UI
import { Paper } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";

// Components
import AddFriendButton from "../friends/AddFriendButton";
import Avatar from "../Avatar";
import UnfriendButton from "../friends/UnfriendButton";

// Contexts
import { UserContext } from "../../components/auth/User";

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
	const { user: loggedUser } = useContext(UserContext);

	const classes = useStyles();

	const lastSeen = useDateComparison(new Date(user.lastSeen), new Date());

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
					<UnfriendButton color="error" id={user.id} username={user.username} />
				) : (
					<AddFriendButton color="primary" id={user.id} />
				))}
		</Paper>
	);
}
export default Profile;
