import { useState } from "react";
import { host } from "../../config";
import Button from "@material-ui/core/Button";
import { FormControl } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import { useTranslation } from "next-i18next";

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

	const { t } = useTranslation("auth");

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(email, username, password, hideEmail);
		fetch(`${host}/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				username,
				password,
				hideEmail,
			}),
		});
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
				/>

				<TextField
					id="username"
					label={t("username")}
					variant="filled"
					type="text"
					onChange={(e) => setUsername(e.target.value)}
					fullWidth
					className={classes.margin}
				/>

				<TextField
					id="password"
					label={t("password")}
					variant="filled"
					type="password"
					onChange={(e) => setPassword(e.target.value)}
					fullWidth
					className={classes.margin}
				/>

				<FormControlLabel
					control={
						<Checkbox
							id="hide-email"
							checked={hideEmail}
							onChange={(e) => setHideEmail(!hideEmail)}
						/>
					}
					label={t("hide-email")}
				/>

				<Button variant="contained" type="submit" size="large">
					{t("register")}
				</Button>

				<Link href="/login" className={classes.margin}>
					{t("have-an-account")}
				</Link>
			</FormControl>
		</form>
	);
}

export default RegisterForm;
