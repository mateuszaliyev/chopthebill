// React & Next
import { useState } from "react";
import { useTranslation } from "next-i18next";

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

// Email
import emailjs from "emailjs-com";

function ForgotPasswordForm() {
	const [email, setEmail] = useState("");

	const { t } = useTranslation(["common", "login"]);

	const handleSubmit = async (e) => {
		e.preventDefault();
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
			return;
		}
		if (error === "") {
			console.log(link);
			// emailjs.send(
			// 	"service_7nvkpk9",
			// 	"template_aqt1aee",
			// 	{ toEmail: email, link: link },
			// 	"user_vzoimumL2sIGHAUUnVuj6"
			// );
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

export default ForgotPasswordForm;
