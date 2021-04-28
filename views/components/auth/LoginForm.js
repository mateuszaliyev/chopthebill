// React & Next
import { useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { Button, FormControl, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import Link from "../Link";

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

				<Button
					className={classes.margin}
					color="primary"
					type="submit"
					variant="contained"
				>
					{t("login:login")}
				</Button>
				<Link href="/">{t("login:forgot-password")}</Link>
				<Link href="/register">{t("login:have-no-account")}</Link>
			</FormControl>
		</form>
	);
}

export default LoginForm;
