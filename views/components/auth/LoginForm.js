import { useState } from "react";
import { host } from "../../config";
import Button from "@material-ui/core/Button";
import { FormControl } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import { useTranslation } from "next-i18next";

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

				<Link href="/" className={classes.margin}>
					{t("login:forgot-password")}
				</Link>

				<Link href="/register" className={classes.margin}>
					{t("login:have-no-account")}
				</Link>
			</FormControl>
		</form>
	);
}

export default LoginForm;
