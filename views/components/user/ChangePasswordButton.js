// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	InputAdornment,
	Snackbar,
	TextField,
	Tooltip,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import LockIcon from "@material-ui/icons/Lock";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../auth/User";

// Styles
const useStyles = makeStyles((theme) => ({
	button: {
		backgroundColor: theme.palette.error.main,
		color: theme.palette.getContrastText(theme.palette.error.main),
		"&:hover": {
			backgroundColor: "rgb(170, 46, 37)",
		},
	},
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
	},
	dialogContent: {
		display: "flex",
		flexDirection: "column",
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
}));

// TextFields
const textFields = [
	{
		name: "password",
		translation: "password",
	},
	{
		name: "newPassword",
		translation: "new-password",
	},
	{
		name: "newPasswordConfirm",
		translation: "new-password-confirm",
	},
];

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ChangePasswordButton() {
	const { t } = useTranslation();

	const [fieldsHelper, setFieldsHelper] = useState({
		password: "",
		newPassword: "",
		newPasswordConfirm: "",
	});
	const [openDialog, setOpenDialog] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [password, setPassword] = useState({
		password: "",
		newPassword: "",
		newPasswordConfirm: "",
	});
	const [visibility, setVisibility] = useState({
		password: false,
		newPassword: false,
		newPasswordConfirm: false,
	});

	const { accessToken } = useContext(UserContext);

	const classes = useStyles();
	const theme = useTheme();
	const bpsm = useMediaQuery(theme.breakpoints.up("sm"));

	const handleChangePassClick = () => {
		setOpenDialog((prevOpen) => !prevOpen);
	};

	const handleClose = () => {
		setOpenDialog(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await fetch(`${host}/password`, {
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(password),
		});
		const issues = await res.json();

		if (issues.length > 0) {
			const newFieldsHelper = {
				password: "",
				newPassword: "",
				newPasswordConfirm: "",
			};
			issues.forEach((issue) => {
				if (issue === "wrong-password") {
					newFieldsHelper.password += t(`validation:${issue}`) + ". ";
				}

				if (issue === "password-invalid") {
					newFieldsHelper.newPassword += t(`validation:${issue}`) + ". ";
				}

				if (issue === "passwords-do-not-match") {
					newFieldsHelper.newPasswordConfirm += t(`validation:${issue}`) + ". ";
				}
			});
			setFieldsHelper(newFieldsHelper);
		} else {
			setOpenDialog(false);
			setOpenSnackbar(true);
		}
	};

	const handleVisibility = (key) => {
		setVisibility((prevVisibility) => ({
			...prevVisibility,
			[key]: !prevVisibility[key],
		}));
	};

	return (
		<>
			<Button
				className={classes.button}
				onClick={handleChangePassClick}
				startIcon={<LockIcon />}
				variant="contained"
			>
				{t("change-password")}
			</Button>
			<Dialog
				fullScreen={!bpsm}
				fullWidth
				onClose={handleClose}
				open={openDialog}
			>
				<form onSubmit={handleSubmit}>
					<DialogTitle>
						{t("change-password")}
						<Tooltip title={t("cancel")}>
							<IconButton className={classes.closeButton} onClick={handleClose}>
								<CloseIcon />
							</IconButton>
						</Tooltip>
					</DialogTitle>
					<DialogContent className={classes.dialogContent}>
						{textFields.map((el, index) => (
							<TextField
								autoFocus={index === 0}
								error={fieldsHelper[el.name].length > 0}
								helperText={fieldsHelper[el.name]}
								key={el.name}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={() => handleVisibility(el.name)}
												tabIndex="-1"
											>
												{visibility[el.name] ? (
													<VisibilityOffIcon />
												) : (
													<VisibilityIcon />
												)}
											</IconButton>
										</InputAdornment>
									),
								}}
								label={t(`validation:${el.translation}`)}
								onChange={(e) => {
									setPassword((prevPassword) => ({
										...prevPassword,
										[el.name]: e.target.value,
									}));
								}}
								type={visibility[el.name] ? "text" : "password"}
							/>
						))}
					</DialogContent>
					<DialogActions>
						<Button color="primary" onClick={handleClose}>
							{t("cancel")}
						</Button>
						<Button className={classes.red} type="submit">
							{t("change-password")}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
			<Snackbar
				open={openSnackbar}
				autoHideDuration={6000}
				onClose={() => setOpenSnackbar(false)}
			>
				<Alert
					onClose={() => setOpenSnackbar((prevSnackbar) => !prevSnackbar)}
					severity="success"
				>
					{t("password-change-success")}
				</Alert>
			</Snackbar>
		</>
	);
}

export default ChangePasswordButton;
