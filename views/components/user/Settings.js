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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
}));

function Settings() {
	const { t } = useTranslation("common");

	const { user, accessToken } = useContext(UserContext);
	const { setTheme, setPalette } = useContext(ThemeContext);

	const classes = useStyles();

	const router = useRouter();

	const [fieldsHelper, setFieldsHelper] = useState({
		email: "",
		username: "",
		hideEmail: "",
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
		const issues = await res.json();

		if (issues.length > 0) {
			const newFieldsHelper = {
				email: "",
				username: "",
				hideEmail: "",
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

	return (
		<>
			<Paper component="form" onSubmit={handleSubmit}>
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
						<Button variant="contained" color="primary" type="submit">
							{t("confirm")}
						</Button>
					</div>
				</List>
			</Paper>
			<div className={classes.buttons}>
				<Button variant="contained" color="secondary">
					{t("change-password")}
				</Button>
				<Button variant="outlined" color="secondary">
					{t("delete-account")}
				</Button>
			</div>
		</>
	);
}
export default Settings;
