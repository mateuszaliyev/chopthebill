// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../auth/User";

// Styles
const useStyles = makeStyles((theme) => ({
	red: {
		color: theme.palette.error.main,
		"&:hover": {
			backgroundColor: `${theme.palette.error.main}${parseInt(
				255 * theme.palette.action.hoverOpacity
			)
				.toString(16)
				.padStart(2, "0")}`,
		},
	},
}));

function UnfriendButton({
	color = "inherit",
	edge = false,
	id,
	onUnfriend,
	username,
}) {
	const { t } = useTranslation(["common", "friends"]);

	const { accessToken } = useContext(UserContext);
	const [open, setOpen] = useState(false);

	const classes = useStyles();

	const unfriend = async () => {
		setOpen(false);

		if (id) {
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
				onUnfriend(id);
			}
		}
	};

	return (
		<>
			<Tooltip title={t("unfriend")}>
				<IconButton edge={edge} onClick={() => setOpen(true)}>
					<DeleteIcon color={color} />
				</IconButton>
			</Tooltip>
			<Dialog onClose={() => setOpen(false)} open={open}>
				<DialogTitle>{t("friends:unfriend-title", { username })}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{t("friends:unfriend-text", { username })}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="primary" onClick={() => setOpen(false)}>
						{t("cancel")}
					</Button>
					<Button autoFocus className={classes.red} onClick={unfriend}>
						{t("unfriend")}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default UnfriendButton;
