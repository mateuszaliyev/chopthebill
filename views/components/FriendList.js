// React & Next
import { useContext } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Material UI
import {
	Button,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import Avatar from "./Avatar";
import Link from "./Link";

// Config
import { host } from "../config";

// Contexts
import { UserContext } from "../components/auth/User";

// Hooks
import useDateComparison from "./hooks/useDateComparison";

// Styles
const useStyles = makeStyles((theme) => ({
	padding: {
		paddingBottom: "1rem",
		paddingTop: "1rem",
	},
}));

function FriendListLastSeen({ friend }) {
	const lastSeen = useDateComparison(new Date(friend.lastSeen), new Date());
	return <ListItemText>{lastSeen}</ListItemText>;
}

function FriendList({ friends }) {
	const { t } = useTranslation(["common", "friends"]);

	const { accessToken } = useContext(UserContext);

	const classes = useStyles();

	const router = useRouter();

	const unfriend = async (id) => {
		const res = await fetch(`${host}/friend`, {
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				id,
			}),
		});
		if (res.ok) {
			router.reload();
		}
	};

	return (
		<List>
			{friends.map((friend) => (
				<Link
					color="inherit"
					href={`/user/${friend.id}`}
					key={friend.id}
					underline="none"
				>
					<ListItem button className={friend.email ? "" : classes.padding}>
						<ListItemAvatar>
							<Avatar alt={friend.username} />
						</ListItemAvatar>
						<ListItemText primary={friend.username} secondary={friend.email} />
						<FriendListLastSeen friend={friend} />
						<Button
							onClick={() => unfriend(friend.id)}
							variant="contained"
							color="secondary"
						>
							{t("unfriend")}
						</Button>
					</ListItem>
				</Link>
			))}
		</List>
	);
}

export default FriendList;
