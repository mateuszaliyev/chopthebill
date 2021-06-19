// React & Next
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
	IconButton,
	InputAdornment,
	TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

// Components
import Link from "../Link";

// Config
import { host } from "../../config";

// Contexts
import { ThemeContext } from "../Theme";

// Styles
const useStyles = makeStyles({
	margin: {
		marginTop: "1rem",
	},
});

function RegisterForm() {
	const { t } = useTranslation();

	const [email, setEmail] = useState("");
	const [hideEmail, setHideEmail] = useState(false);
	const [fieldsHelper, setFieldsHelper] = useState({
		email: "",
		username: "",
		password: "",
		passwordConfirm: "",
		hideEmail: "",
	});
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [username, setUsername] = useState("");
	const [visibility, setVisibility] = useState({
		password: false,
		passwordConfirm: false,
	});

	const { palette, theme } = useContext(ThemeContext);

	const classes = useStyles();
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await fetch(`${host}/register`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				username,
				password,
				passwordConfirm,
				hideEmail,
				language: router.locale,
				theme: `${theme}-${palette}`,
			}),
		});

		const issues = await res.json();

		if (issues.length > 0) {
			const newFieldsHelper = {
				email: "",
				username: "",
				password: "",
				passwordConfirm: "",
				hideEmail: "",
			};

			issues.forEach((issue) => {
				if (issue.indexOf("email") !== -1) {
					newFieldsHelper.email += t(`register:${issue}`) + ". ";
				}

				if (issue.indexOf("username") !== -1) {
					newFieldsHelper.username += t(`register:${issue}`) + ". ";
				}

				if (issue.indexOf("password") !== -1) {
					issue === "passwords-do-not-match"
						? (newFieldsHelper.passwordConfirm += t(`register:${issue}`) + ". ")
						: (newFieldsHelper.password += t(`register:${issue}`) + ". ");
				}

				if (issue.indexOf("exclusion") !== -1) {
					newFieldsHelper.hideEmail += t(`register:${issue}`) + ". ";
				}
			});

			setFieldsHelper(newFieldsHelper);
		} else {
			router.push("/login");
		}
	};

	const handleVisibility = (key) => {
		setVisibility((prevVisibility) => ({
			...prevVisibility,
			[key]: !prevVisibility[key],
		}));
	};

	return (
		<form autoComplete="off" onSubmit={handleSubmit}>
			<FormControl fullWidth>
				<TextField
					className={classes.margin}
					error={fieldsHelper.email.length > 0}
					helperText={fieldsHelper.email}
					label={t("email-address")}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
				/>

				<TextField
					className={classes.margin}
					error={fieldsHelper.username.length > 0}
					helperText={fieldsHelper.username}
					label={t("username")}
					onChange={(e) => setUsername(e.target.value)}
					type="text"
				/>

				<TextField
					className={classes.margin}
					error={fieldsHelper.password.length > 0}
					helperText={fieldsHelper.password}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={() => handleVisibility("password")}
									tabIndex="-1"
								>
									{visibility.password ? (
										<VisibilityOffIcon />
									) : (
										<VisibilityIcon />
									)}
								</IconButton>
							</InputAdornment>
						),
					}}
					label={t("password")}
					onChange={(e) => setPassword(e.target.value)}
					type={visibility.password ? "text" : "password"}
				/>

				<TextField
					className={classes.margin}
					error={fieldsHelper.passwordConfirm.length > 0}
					helperText={fieldsHelper.passwordConfirm}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={() => handleVisibility("passwordConfirm")}
									tabIndex="-1"
								>
									{visibility.passwordConfirm ? (
										<VisibilityOffIcon />
									) : (
										<VisibilityIcon />
									)}
								</IconButton>
							</InputAdornment>
						),
					}}
					label={t("password-confirm")}
					onChange={(e) => setPasswordConfirm(e.target.value)}
					type={visibility.passwordConfirm ? "text" : "password"}
				/>

				<FormControl
					className={classes.margin}
					error={fieldsHelper.hideEmail.length > 0}
				>
					<FormControlLabel
						control={
							<Checkbox
								color="primary"
								id="hide-email"
								checked={hideEmail}
								onChange={(e) => setHideEmail(!hideEmail)}
							/>
						}
						label={t("register:hide-email")}
					/>
					<FormHelperText>{fieldsHelper.hideEmail}</FormHelperText>
				</FormControl>

				<Button
					className={classes.margin}
					color="primary"
					size="large"
					type="submit"
					variant="contained"
				>
					{t("register:register")}
				</Button>

				<Link className={classes.margin} href="/login">
					{t("register:have-an-account")}
				</Link>
			</FormControl>
		</form>
	);
}

export default RegisterForm;
