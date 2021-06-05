// React & Next
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

// Material UI
import { Button, FormControl, TextField, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";

// Config
import { host } from "../../config";

// Styles
const useStyles = makeStyles({
	margin: {
		marginTop: "1rem",
	},
});

// Email
import emailjs from "emailjs-com";

function ForgotPasswordForm({ onSubmit }) {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [open, setOpen] = useState(false);

	const router = useRouter();
	const { t } = useTranslation(["common", "login"]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		onSubmit();
		const res = await fetch(`${host}/forgot-password`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
			}),
		});
		const { link, error } = await res.json();
		if (error === "invalid-email") {
			setError(t("login:invalid-email"));
			return;
		}
		if (error === "") {
			console.log(link);
			setError("");
			setOpen(true);
			// emailjs.send(
			// 	"service_7nvkpk9",
			// 	"template_aqt1aee",
			// 	{ toEmail: email, link: link },
			// 	"user_vzoimumL2sIGHAUUnVuj6"
			// );
		}
	};

	const handleClose = () => {
		setOpen(false);
		router.push("/login");
	};

	const classes = useStyles();

	return (
		<>
			<form onSubmit={handleSubmit} autoComplete="off">
				<FormControl fullWidth>
					{t("login:forgot-password-text")}
					<TextField
						id="email"
						label="Email"
						type="email"
						onChange={(e) => setEmail(e.target.value)}
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
						{t("login:send")}
					</Button>
				</FormControl>
			</form>
			<Snackbar open={open}>
				<Alert severity="success" onClose={handleClose}>
					{t("login:email-sent")}
				</Alert>
			</Snackbar>
		</>
	);
}

export default ForgotPasswordForm;
