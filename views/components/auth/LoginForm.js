// React & Next
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

// Material UI
import { Button, FormControl, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Config
import { host } from "../../config";

const useStyles = makeStyles({
	margin: {
		marginTop: "1rem",
	},
});

function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { t } = useTranslation(["common", "login"]);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(email, password);
		// fetch(`${host}/login`, {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		email,
		// 		password,
		// 	}),
		// });
	};

	const classes = useStyles();

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			<FormControl fullWidth>
				<TextField
					id="email"
					label="Email"
					variant="filled"
					type="email"
					onChange={(e) => setEmail(e.target.value)}
					className={classes.margin}
				/>

				<TextField
					id="password"
					label={t("password")}
					variant="filled"
					type="password"
					onChange={(e) => setPassword(e.target.value)}
					className={classes.margin}
				/>

				<Button variant="contained" type="submit" className={classes.margin}>
					{t("login:login")}
				</Button>

				<div className="auth-link">
					<Link href="/">
						<a>{t("login:forgot-password")}</a>
					</Link>
				</div>

				<div className="auth-link">
					<Link href="/register">
						<a>{t("login:have-no-account")}</a>
					</Link>
				</div>
			</FormControl>
		</form>
	);
}

export default LoginForm;
