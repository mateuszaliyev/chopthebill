// React & Next
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { host } from "../../config";

// Material UI
import {
	Button,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	MenuItem,
	Paper,
	Select,
	Switch,
	TextField,
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormGroup,
	Dialog,
	DialogContent,
	DialogTitle,
	useMediaQuery,
	Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import EmailIcon from "@material-ui/icons/Email";
import PaletteIcon from "@material-ui/icons/Palette";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import TranslateIcon from "@material-ui/icons/Translate";

// Contexts
import { UserContext } from "../auth/User";
import { ThemeContext } from "../Theme";

import DeleteAccountButton from "./DeleteAccountButton";

// Styles
const useStyles = makeStyles((theme) => ({
	button: {
		display: "flex",
		justifyContent: "center",
		margin: theme.spacing(1),
	},
	buttons: {
		display: "flex",
		justifyContent: "center",
		margin: theme.spacing(2),
		gap: theme.spacing(3),
	},
	inputField: {
		minWidth: 200,
		textAlign: "center",
	},
	red: {
		backgroundColor: theme.palette.error.main,
		color: theme.palette.getContrastText(theme.palette.error.main),
		"&:hover": {
			backgroundColor: "rgb(170, 46, 37)",
		},
	},
}));

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Settings() {
	const { t } = useTranslation("common");

	const { user, accessToken } = useContext(UserContext);
	const { setTheme, setPalette } = useContext(ThemeContext);

	const classes = useStyles();

	const router = useRouter();

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const [fieldsHelper, setFieldsHelper] = useState({
		email: "",
		username: "",
		hideEmail: "",
		oldPassword: "",
		newPassword: "",
		newPasswordRepeated: "",
	});

	const [settings, setSettings] = useState({
		username: user.username === user.email ? "" : user.username,
		email: user.email,
		language: user.language,
		hideEmail: user.hideEmail,
		theme: user.theme,
	});

	const changeTheme = () => {
		setTheme(settings.theme.split("-")[0]);
		setPalette(settings.theme.split("-")[1]);
	};

	const handleLanguage = (e) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			language: e.target.value,
		}));
	};

	const handleUsername = (e) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			username: e.target.value,
		}));
	};

	const handleEmail = (e) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			email: e.target.value,
		}));
	};

	const handleHideEmail = (e) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			hideEmail: e.target.checked,
		}));
	};

	const handleTheme = (e) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			theme: `${e.target.value}-${prevSettings.theme.split("-")[1]}`,
		}));
	};

	const handlePalette = (e) => {
		const palette = e.target.checked ? "light" : "dark";
		setSettings((prevSettings) => ({
			...prevSettings,
			theme: `${prevSettings.theme.split("-")[0]}-${palette}`,
		}));
	};

	useEffect(changeTheme, [settings]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await fetch(`${host}/settings`, {
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(settings),
		});
		const { issues } = await res.json();

		if (issues.length > 0) {
			const newFieldsHelper = {
				email: "",
				username: "",
				hideEmail: "",
				oldPassword: "",
				newPassword: "",
				newPasswordRepeated: "",
			};
			issues.forEach((issue) => {
				if (issue.indexOf("email") !== -1) {
					newFieldsHelper.email += t(`register:${issue}`) + ". ";
				}

				if (issue.indexOf("username") !== -1) {
					newFieldsHelper.username += t(`register:${issue}`) + ". ";
				}

				if (issue.indexOf("exclusion") !== -1) {
					newFieldsHelper.hideEmail += t(`register:${issue}`) + ". ";
				}
			});
			setFieldsHelper(newFieldsHelper);
		} else {
			if (settings.language !== user.language) {
				router.replace(router.asPath, router.asPath, {
					locale: settings.language,
				});
			} else router.reload();
		}
	};

	const [password, setPassword] = useState({
		oldPassword: "",
		newPassword: "",
		newPasswordRepeated: "",
	});

	const [openPassword, setPasswordOpen] = useState(false);

	const handleChangePassClick = () => {
		setPasswordOpen((prevPasswordOpen) => !prevPasswordOpen);
	};

	const [openSnackbar, setSnackbar] = useState(false);

	const handleChangePassSubmit = async (e) => {
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
		const { issues } = await res.json();

		if (issues.length > 0) {
			const newFieldsHelper = {
				email: "",
				username: "",
				hideEmail: "",
				oldPassword: "",
				newPassword: "",
				newPasswordRepeated: "",
			};
			issues.forEach((issue) => {
				if (issue === "password-different") {
					newFieldsHelper.oldPassword += t(`${issue}`) + ". ";
				}

				if (issue === "new-password-invalid") {
					newFieldsHelper.newPassword += t(`${issue}`) + ". ";
				}

				if (issue === "new-password-repeated-different") {
					newFieldsHelper.newPasswordRepeated += t(`${issue}`) + ". ";
				}
			});
			setFieldsHelper(newFieldsHelper);
		} else {
			setPasswordOpen(false);
			setSnackbar(true);
		}
	};

	const [openDeleteAccount, setDeleteAccount] = useState(false);

	const handleClose = () => {
		setPasswordOpen(false);
		setDeleteAccount(false);
	};

	return (
		<>
			<Paper component="form" id="settings" onSubmit={handleSubmit}>
				<List>
					<ListItem>
						<ListItemIcon>
							<TextFieldsIcon />
						</ListItemIcon>
						<ListItemText>{t("username")}</ListItemText>
						<ListItemSecondaryAction>
							<TextField
								className={classes.inputField}
								inputProps={{ style: { textAlign: "center" } }}
								defaultValue={
									settings.username === settings.email ? "" : settings.username
								}
								onChange={handleUsername}
								helperText={fieldsHelper.username}
								error={fieldsHelper.username.length > 0}
							/>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<AlternateEmailIcon />
						</ListItemIcon>
						<ListItemText>Email</ListItemText>
						<ListItemSecondaryAction>
							<TextField
								type="email"
								className={classes.inputField}
								inputProps={{ style: { textAlign: "center" } }}
								defaultValue={settings.email}
								onChange={handleEmail}
								helperText={fieldsHelper.email}
								error={fieldsHelper.email.length > 0}
							/>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<TranslateIcon />
						</ListItemIcon>
						<ListItemText>{t("language")}</ListItemText>
						<ListItemSecondaryAction>
							<Select
								className={classes.inputField}
								value={settings.language}
								onChange={handleLanguage}
							>
								<MenuItem value="en">{t("en")}</MenuItem>
								<MenuItem value="pl">{t("pl")}</MenuItem>
							</Select>
						</ListItemSecondaryAction>
					</ListItem>
					<FormControl
						error={fieldsHelper.hideEmail.length > 0}
						style={{ width: "100%" }}
					>
						<FormGroup>
							<ListItem>
								<ListItemIcon>
									<EmailIcon />
								</ListItemIcon>
								<ListItemText>{t("hide-email")}</ListItemText>
								<ListItemSecondaryAction>
									<FormControlLabel
										style={{ marginRight: "0" }}
										control={
											<Switch
												color="primary"
												onChange={handleHideEmail}
												checked={settings.hideEmail}
											></Switch>
										}
									/>
								</ListItemSecondaryAction>
							</ListItem>
						</FormGroup>
						<FormHelperText style={{ textAlign: "center" }}>
							{fieldsHelper.hideEmail}
						</FormHelperText>
					</FormControl>
					<ListItem>
						<ListItemIcon>
							<PaletteIcon />
						</ListItemIcon>
						<ListItemText>{t("theme")}</ListItemText>
						<ListItemSecondaryAction>
							<Select
								className={classes.inputField}
								value={settings.theme.split("-")[0]}
								onChange={handleTheme}
							>
								<MenuItem value="default">{t("default")}</MenuItem>
								<MenuItem value="alternative">{t("alternative")}</MenuItem>
							</Select>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem>
						<ListItemIcon>
							{settings.theme.split("-")[1] === "light" ? (
								<Brightness7Icon />
							) : (
								<Brightness4Icon />
							)}
						</ListItemIcon>
						<ListItemText>{t("palette")}</ListItemText>
						<ListItemSecondaryAction>
							<Switch
								color="primary"
								onChange={handlePalette}
								checked={settings.theme.split("-")[1] === "light"}
							></Switch>
						</ListItemSecondaryAction>
					</ListItem>
					<div className={classes.button}>
						<Button
							variant="contained"
							color="primary"
							type="submit"
							form="settings"
						>
							{t("confirm")}
						</Button>
					</div>
				</List>
			</Paper>
			<div className={classes.buttons}>
				<Button
					className={classes.red}
					onClick={handleChangePassClick}
					variant="contained"
				>
					{t("change-password")}
				</Button>
				<DeleteAccountButton />
			</div>
			<Dialog
				fullScreen={fullScreen}
				onClose={handleClose}
				fullWidth={true}
				open={openPassword}
			>
				<DialogTitle>Test</DialogTitle>
				<DialogContent dividers>
					<Paper
						component="form"
						id="password"
						onSubmit={handleChangePassSubmit}
					>
						<List>
							<ListItem>
								<ListItemText>{t("old-password")}</ListItemText>
								<ListItemSecondaryAction>
									<TextField
										className={classes.inputField}
										inputProps={{ style: { textAlign: "center" } }}
										type="password"
										onChange={(e) => {
											setPassword((prevPassword) => ({
												...prevPassword,
												oldPassword: e.target.value,
											}));
										}}
										helperText={fieldsHelper.oldPassword}
										error={fieldsHelper.oldPassword.length > 0}
									/>
								</ListItemSecondaryAction>
							</ListItem>
							<ListItem>
								<ListItemText>{t("new-password")}</ListItemText>
								<ListItemSecondaryAction>
									<TextField
										className={classes.inputField}
										inputProps={{ style: { textAlign: "center" } }}
										type="password"
										onChange={(e) => {
											setPassword((prevPassword) => ({
												...prevPassword,
												newPassword: e.target.value,
											}));
										}}
										helperText={fieldsHelper.newPassword}
										error={fieldsHelper.newPassword.length > 0}
									/>
								</ListItemSecondaryAction>
							</ListItem>
							<ListItem>
								<ListItemText>{t("old-password-repeated")}</ListItemText>
								<ListItemSecondaryAction>
									<TextField
										className={classes.inputField}
										inputProps={{ style: { textAlign: "center" } }}
										type="password"
										onChange={(e) => {
											setPassword((prevPassword) => ({
												...prevPassword,
												newPasswordRepeated: e.target.value,
											}));
										}}
										helperText={fieldsHelper.newPasswordRepeated}
										error={fieldsHelper.newPasswordRepeated.length > 0}
									/>
								</ListItemSecondaryAction>
							</ListItem>
							<div className={classes.button}>
								<Button
									variant="contained"
									color="primary"
									//Click={handleChangePassSubmit}
									type="submit"
								>
									{t("confirm")}
								</Button>
							</div>
						</List>
					</Paper>
				</DialogContent>
			</Dialog>
			<Snackbar
				open={openSnackbar}
				autoHideDuration={6000}
				onClose={() => setSnackbar(false)}
			>
				<Alert onClose={handleClose} severity="success">
					{t("password-change-success")}
				</Alert>
			</Snackbar>
			<Dialog
				fullScreen={fullScreen}
				onClose={handleClose}
				fullWidth={true}
				open={openDeleteAccount}
			>
				<DialogTitle>Test</DialogTitle>
				<DialogContent dividers>test2</DialogContent>
			</Dialog>
		</>
	);
}
export default Settings;
