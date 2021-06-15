// React & Next
import { useContext } from "react";
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
	makeStyles,
	Tooltip,
	useMediaQuery,
	useTheme,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../auth/User";

// Styles
const useStyles = makeStyles((theme) => ({
	button: {
		border: `1px solid ${theme.palette.error.main}80`,
		color: theme.palette.error.main,
		"&:hover": {
			backgroundColor: `${theme.palette.error.main}${parseInt(
				255 * theme.palette.action.hoverOpacity
			)
				.toString(16)
				.padStart(2, "0")}`,
			border: `1px solid ${theme.palette.error.main}`,
		},
	},
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
	},
	content: {
		alignItems: "center",
		display: "flex",
		gap: "1rem",
	},
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
	text: {
		alignItems: "center",
		display: "flex",
		gap: "1rem",
		marginTop: "0.75rem",
	},
	title: {
		backgroundColor: theme.palette.error.main,
		color: theme.palette.getContrastText(theme.palette.error.main),
	},
}));

function GroupDeleteDialog({ group, onClose, open }) {
	const { t } = useTranslation(["common", "user", "validation"]);

	const { accessToken } = useContext(UserContext);

	const classes = useStyles();
	const theme = useTheme();
	const bpsm = useMediaQuery(theme.breakpoints.up("sm"));

	const handleClose = (returnValue) => {
		onClose(returnValue);
	};

	const handleDelete = async (e) => {
		e.preventDefault();
		const res = await fetch(`${host}/groups/${group.id}`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});
		if (res.ok) {
			handleClose("success");
		} else {
			handleClose("error");
		}
	};

	return (
		<Dialog fullWidth onClose={() => handleClose(null)} open={open}>
			<form onSubmit={handleDelete}>
				<DialogTitle className={classes.title}>
					{t("groups:delete-group-title", { name: group?.name })}
					<Tooltip title={t("cancel")}>
						<IconButton
							color="inherit"
							className={classes.closeButton}
							onClick={() => handleClose(null)}
						>
							<CloseIcon />
						</IconButton>
					</Tooltip>
				</DialogTitle>
				<DialogContent className={classes.content}>
					{bpsm && (
						<DeleteForeverIcon color="error" style={{ fontSize: "4rem" }} />
					)}
					<DialogContentText className={classes.text}>
						{t("groups:delete-group-details")}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="primary" onClick={() => handleClose(null)}>
						{t("cancel")}
					</Button>
					<Button className={classes.red} type="submit">
						{t("groups:delete-group")}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default GroupDeleteDialog;
