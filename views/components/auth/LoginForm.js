// React & Next
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Material UI
import { Button, FormControl, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import Link from "../Link";

// Config
import { host } from "../../config";

// Context
import { ThemeContext } from "../Theme";
import { UserContext } from "./User";

const useStyles = makeStyles({
	margin: {
		marginTop: "1rem",
	},
});

function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fieldsHelper, setFieldsHelper] = useState("");
	const { setPalette, setTheme } = useContext(ThemeContext);
	const { setAccessToken, setUser } = useContext(UserContext);

	const { t } = useTranslation(["common", "login"]);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch(`${host}/login`, {
			method: "POST",
			credentials: "include",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});
		const { accessToken, user, error } = await res.json();
		if (error === "internal-server-error") {
			router.push("/500");
			return;
		}

		if (error === "login-data-invalid") {
			setFieldsHelper(t(`login:${error}`));
		} else {
			setAccessToken(accessToken);
			setPalette(user.theme.split("-")[1] || "light");
			setTheme(user.theme.split("-")[0] || "default");
			setUser(user);
			router.push(`${user.language}/dashboard`);
		}
	};

	const classes = useStyles();

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			<FormControl fullWidth>
				<TextField
					id="email"
					label="Email"
					type="email"
					onChange={(e) => setEmail(e.target.value)}
					className={classes.margin}
					error={Boolean(fieldsHelper)}
				/>

				<TextField
					id="password"
					label={t("password")}
					type="password"
					onChange={(e) => setPassword(e.target.value)}
					className={classes.margin}
					helperText={fieldsHelper}
					error={Boolean(fieldsHelper)}
				/>

				<Button
					className={classes.margin}
					color="primary"
					type="submit"
					variant="contained"
				>
					{t("login:login")}
				</Button>
				<Link className={classes.margin} href="/">
					{t("login:forgot-password")}
				</Link>
				<Link className={classes.margin} href="/register">
					{t("login:have-no-account")}
				</Link>
			</FormControl>
		</form>
	);
}

export default LoginForm;
