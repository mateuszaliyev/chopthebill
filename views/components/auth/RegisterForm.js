// React & Next
import { useState } from "react";
import Link from "next/link";
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

// Config
import { host } from "../../config";

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

	const router = useRouter();

	const { t } = useTranslation(["common", "register"]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(email, username, password, hideEmail);
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
				theme: "dark",
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
					variant="filled"
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
					variant="filled"
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
					variant="filled"
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
								id="hide-email"
								checked={hideEmail}
								onChange={(e) => setHideEmail(!hideEmail)}
							/>
						}
						label={t("register:hide-email")}
					/>
					<FormHelperText>{fieldsHelper.hideEmail}</FormHelperText>
				</FormControl>

				<Button variant="contained" type="submit" size="large">
					{t("register:register")}
				</Button>

				<div className="auth-link">
					<Link href="/login">
						<a>{t("register:have-an-account")}</a>
					</Link>
				</div>
			</FormControl>
		</form>
	);
}

export default RegisterForm;
