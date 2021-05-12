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
	TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [hideEmail, setHideEmail] = useState(false);
	const [fieldsHelper, setFieldsHelper] = useState({
		email: "",
		username: "",
		password: "",
		hideEmail: "",
	});

	const { palette, theme } = useContext(ThemeContext);
	const router = useRouter();
	const { t } = useTranslation(["common", "register"]);

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
					newFieldsHelper.password += t(`register:${issue}`) + ". ";
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

	const classes = useStyles();

	return (
		<form onSubmit={handleSubmit} autoComplete="off" className="auth-form">
			<FormControl fullWidth>
				<TextField
					id="email"
					label="Email"
					type="email"
					onChange={(e) => setEmail(e.target.value)}
					fullWidth
					className={classes.margin}
					helperText={fieldsHelper.email}
					error={fieldsHelper.email.length > 0}
				/>

				<TextField
					id="username"
					label={t("username")}
					type="text"
					onChange={(e) => setUsername(e.target.value)}
					fullWidth
					className={classes.margin}
					helperText={fieldsHelper.username}
					error={fieldsHelper.username.length > 0}
				/>

				<TextField
					id="password"
					label={t("password")}
					type="password"
					onChange={(e) => setPassword(e.target.value)}
					fullWidth
					className={classes.margin}
					helperText={fieldsHelper.password}
					error={fieldsHelper.password.length > 0}
				/>

				<FormControl error={fieldsHelper.hideEmail.length > 0}>
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

				<Button color="primary" size="large" type="submit" variant="contained">
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
