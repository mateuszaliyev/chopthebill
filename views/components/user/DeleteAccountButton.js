// React & Next
import { useContext, useState } from "react";
import { useRouter } from "next/router";
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
	InputAdornment,
	TextField,
	Tooltip,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

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

function DeleteAccountButton() {
	const { t } = useTranslation();

	const [fieldHelper, setFieldHelper] = useState("");
	const [open, setOpen] = useState(false);
	const [password, setPassword] = useState("");
	const [visibility, setVisibility] = useState(false);

	const { accessToken } = useContext(UserContext);

	const router = useRouter();
	const classes = useStyles();
	const theme = useTheme();
	const bpsm = useMediaQuery(theme.breakpoints.up("sm"));

	const handleClose = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch(`${host}/delete`, {
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				password,
			}),
		});

		if (res.ok) {
			setOpen(false);
			router.replace("/logout");
		} else {
			const { error } = await res.json();
			setFieldHelper(t(`validation:${error}`));
		}
	};

	const handleVisibility = () => {
		setVisibility((prevVisibility) => !prevVisibility);
	};

	return (
		<>
			<Button
				className={classes.button}
				onClick={handleClose}
				startIcon={<DeleteForeverIcon />}
				variant="outlined"
			>
				{t("user:delete-account")}
			</Button>
			<Dialog fullWidth onClose={handleClose} open={open}>
				<form onSubmit={handleSubmit}>
					<DialogTitle className={classes.title}>
						{t("user:delete-account-title")}
						<Tooltip title={t("cancel")}>
							<IconButton
								color="inherit"
								className={classes.closeButton}
								onClick={handleClose}
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
							{t("user:delete-account-details")}
						</DialogContentText>
					</DialogContent>
					<DialogContent className={classes.content}>
						<TextField
							autoFocus
							error={fieldHelper.length > 0}
							helperText={fieldHelper}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={handleVisibility}>
											{visibility ? <VisibilityOffIcon /> : <VisibilityIcon />}
										</IconButton>
									</InputAdornment>
								),
							}}
							label={t("password")}
							onChange={(e) => setPassword(e.target.value)}
							style={{ flexGrow: "1" }}
							type={visibility ? "text" : "password"}
						/>
					</DialogContent>
					<DialogActions>
						<Button color="primary" onClick={handleClose}>
							{t("cancel")}
						</Button>
						<Button className={classes.red} type="submit">
							{t("user:delete-account")}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
export default DeleteAccountButton;
