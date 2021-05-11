import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

import TextFieldsIcon from "@material-ui/icons/TextFields";
import EmailIcon from "@material-ui/icons/Email";
import TranslateIcon from "@material-ui/icons/Translate";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import PaletteIcon from "@material-ui/icons/Palette";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";

import { useTranslation } from "next-i18next";

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../components/auth/User";

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

	const { user } = useContext(UserContext);

	const [settings, setSettings] = useState({
		username: user.username,
		email: user.email,
		language: user.language,
		hideEmail: user.hideEmail,
		theme: user.theme,
	});

	const classes = useStyles();

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

	useEffect(() => console.log(settings), [settings]);

	return (
		<>
			<Paper>
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
								defaultValue={settings.username}
								onChange={handleUsername}
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
								className={classes.inputField}
								inputProps={{ style: { textAlign: "center" } }}
								defaultValue={settings.email}
								onChange={handleEmail}
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
					<ListItem>
						<ListItemIcon>
							<EmailIcon />
						</ListItemIcon>
						<ListItemText>{t("hide-email")}</ListItemText>
						<ListItemSecondaryAction>
							<Switch
								color="primary"
								onChange={handleHideEmail}
								checked={settings.hideEmail}
							></Switch>
						</ListItemSecondaryAction>
					</ListItem>
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
						<ListItemText>{t("theme")}</ListItemText>
						<ListItemSecondaryAction>
							<Switch
								color="primary"
								onChange={handlePalette}
								checked={settings.theme.split("-")[1] === "light"}
							></Switch>
						</ListItemSecondaryAction>
					</ListItem>
					<div className={classes.button}>
						<Button variant="contained" color="primary">
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
