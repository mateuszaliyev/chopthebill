// React & Next
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Material UI
import { Button, FormControl, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Config
import { host } from "../../config";

// Styles
const useStyles = makeStyles({
	margin: {
		marginTop: "1rem",
	},
});

function ResetPasswordForm() {
	const router = useRouter();
	const { id, token } = router.query;
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const { t } = useTranslation(["common", "login"]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch(`${host}/reset-password`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				password,
				id,
				token,
			}),
		});
		const { error } = await res.json();
		if (error === "invalid-password") {
			setError(t("new-password-invalid"));
			return;
		}
		if (error === "link-expired") {
			setError(t("login:link-expired"));
			return;
		}
		if (error === "invalid-link") {
			setError(t("login:invalid-link"));
			return;
		}
		if (!error) {
			router.push("/login");
		}
	};

	const classes = useStyles();

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			<FormControl fullWidth>
				{t("login:enter-new-password")}
				<TextField
					id="password"
					label={t("password")}
					type="password"
					onChange={(e) => setPassword(e.target.value)}
					fullWidth
					className={classes.margin}
					helperText={error}
					error={error.length > 0}
				/>
				<Button
					className={classes.margin}
					color="primary"
					type="submit"
					variant="contained"
				>
					{t("login:reset-password")}
				</Button>
			</FormControl>
		</form>
	);
}

export default ResetPasswordForm;
