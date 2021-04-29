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
import { JWTContext } from "../../pages/_app";

const useStyles = makeStyles({
	margin: {
		marginTop: "1rem",
	},
});

function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fieldsHelper, setFieldsHelper] = useState("");
	const jwt = useContext(JWTContext);

	const { t } = useTranslation(["common", "login"]);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch(`${host}/login`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});
		const { accessToken, refreshToken, error } = await res.json();
		if (error === "internal-server-error") {
			router.push("/500");
			return;
		}

		if (error === "login-data-invalid") {
			setFieldsHelper(t(`login:${error}`));
		} else {
			jwt.setAccessToken(accessToken);
			jwt.setRefreshToken(refreshToken);
			router.push("/dashboard");
		}
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
					error={Boolean(fieldsHelper)}
				/>

				<TextField
					id="password"
					label={t("password")}
					variant="filled"
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
				<Link href="/">{t("login:forgot-password")}</Link>
				<Link href="/register">{t("login:have-no-account")}</Link>
			</FormControl>
		</form>
	);
}

export default LoginForm;
