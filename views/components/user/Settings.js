// React & Next
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { host } from "../../config";

// Material UI
import {
	Button,
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormGroup,
	InputLabel,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	MenuItem,
	Paper,
	Select,
	Switch,
	TextField,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import EmailIcon from "@material-ui/icons/Email";
import PaletteIcon from "@material-ui/icons/Palette";
import SaveIcon from "@material-ui/icons/Save";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import TranslateIcon from "@material-ui/icons/Translate";

// Components
import ChangePasswordButton from "./ChangePasswordButton";
import DeleteAccountButton from "./DeleteAccountButton";

// Contexts
import { ThemeContext } from "../Theme";
import { UserContext } from "../auth/User";

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
	item: {
		alignItems: "flex-end",
		display: "flex",
		gap: "1rem",
		"& > svg": {
			marginBottom: "0.25rem",
		},
	},
	inputField: {
		flexGrow: "1",
	},
	switch: {
		// marginLeft: "0",
	},
}));

function Settings() {
	const { t } = useTranslation(["common", "user", "validation"]);

	const { setTheme, setPalette } = useContext(ThemeContext);
	const { user, accessToken } = useContext(UserContext);

	const router = useRouter();
	const classes = useStyles();
	const theme = useTheme();
	const bpsm = useMediaQuery(theme.breakpoints.up("sm"));

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

	const handleLanguage = (e) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			language: e.target.value,
		}));
	};

	const handlePalette = (e) => {
		const palette = e.target.checked ? "light" : "dark";
		setSettings((prevSettings) => ({
			...prevSettings,
			theme: `${prevSettings.theme.split("-")[0]}-${palette}`,
		}));
	};

	const handleTheme = (e) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			theme: `${e.target.value}-${prevSettings.theme.split("-")[1]}`,
		}));
	};

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
				oldPassword: "",
				newPassword: "",
				newPasswordRepeated: "",
			};
			issues.forEach((issue) => {
				if (issue.indexOf("email") !== -1) {
					newFieldsHelper.email += t(`register:${issue}`) + ". ";
				}

				if (issue.indexOf("username") !== -1) {
					newFieldsHelper.username += t(`validation:${issue}`) + ". ";
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

	const handleUsername = (e) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			username: e.target.value,
		}));
	};

	useEffect(changeTheme, [settings]);

	return (
		<>
			<Paper component="form" id="settings" onSubmit={handleSubmit}>
				<List>
					<ListItem className={classes.item}>
						<TextFieldsIcon />
						<TextField
							className={classes.inputField}
							defaultValue={
								settings.username === settings.email ? "" : settings.username
							}
							error={fieldsHelper.username.length > 0}
							helperText={fieldsHelper.username}
							label={t("username")}
							onChange={handleUsername}
						/>
					</ListItem>
					<ListItem className={classes.item}>
						<AlternateEmailIcon />
						<TextField
							className={classes.inputField}
							defaultValue={settings.email}
							error={fieldsHelper.email.length > 0}
							helperText={fieldsHelper.email}
							label={t("email-address")}
							onChange={handleEmail}
						/>
					</ListItem>
					<ListItem className={classes.item}>
						<TranslateIcon />
						<FormControl className={classes.inputField}>
							<InputLabel shrink>{t("language")}</InputLabel>
							<Select onChange={handleLanguage} value={settings.language}>
								<MenuItem value="en">{t("en")}</MenuItem>
								<MenuItem value="pl">{t("pl")}</MenuItem>
							</Select>
						</FormControl>
					</ListItem>
					<ListItem className={classes.item}>
						<PaletteIcon />
						<FormControl className={classes.inputField}>
							<InputLabel shrink>{t("theme")}</InputLabel>
							<Select
								onChange={handleTheme}
								value={settings.theme.split("-")[0]}
							>
								<MenuItem value="default">{t("default")}</MenuItem>
								<MenuItem value="alternative">{t("alternative")}</MenuItem>
							</Select>
						</FormControl>
					</ListItem>
					<ListItem className={classes.item}>
						{settings.theme.split("-")[1] === "light" ? (
							<Brightness7Icon />
						) : (
							<Brightness4Icon />
						)}
						<ListItemText>{t("palette")}</ListItemText>
						<ListItemSecondaryAction>
							<Switch
								checked={settings.theme.split("-")[1] === "light"}
								color="primary"
								edge="end"
								onChange={handlePalette}
							></Switch>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem className={classes.item}>
						<EmailIcon />
						<ListItemText>{t("user:hide-email-address")}</ListItemText>
						<ListItemSecondaryAction>
							<FormControl
								className={classes.switch}
								error={fieldsHelper.hideEmail.length > 0}
							>
								<FormGroup>
									<FormControlLabel
										control={
											<Switch
												checked={settings.hideEmail}
												color="primary"
												edge="end"
												onChange={handleHideEmail}
											></Switch>
										}
										style={{ marginRight: "0" }}
									/>
								</FormGroup>
								<FormHelperText>{fieldsHelper.hideEmail}</FormHelperText>
							</FormControl>
						</ListItemSecondaryAction>
					</ListItem>
					<div className={classes.button}>
						<Button
							color="primary"
							startIcon={<SaveIcon />}
							form="settings"
							type="submit"
							variant="contained"
						>
							{t("save")}
						</Button>
					</div>
				</List>
			</Paper>
			<div className={classes.buttons}>
				<ChangePasswordButton />
				<DeleteAccountButton />
			</div>
		</>
	);
}
export default Settings;
