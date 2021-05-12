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
		if (!error) {
			router.push("/login");
		}
	};

	const classes = useStyles();

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			<FormControl fullWidth>
				<TextField
					id="password"
					label={t("password")}
					type="password"
					onChange={(e) => setPassword(e.target.value)}
					fullWidth
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
			</FormControl>
		</form>
	);
}

export default ResetPasswordForm;
