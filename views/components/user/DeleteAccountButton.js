import { useState, useContext } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { host } from "../../config";

import { UserContext } from "../auth/User";

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Styles
const useStyles = makeStyles((theme) => ({
	button: {
		border: `1px solid ${theme.palette.error.main}80`,
		color: theme.palette.error.main,
		"&:hover": {
			backgroundColor: `${theme.palette.error.main}0a`,
			border: `1px solid ${theme.palette.error.main}`,
		},
	},
	red: {
		color: theme.palette.error.main,
		"&:hover": {
			backgroundColor: `${theme.palette.error.main}0a`,
		},
	},
}));

function DeleteAccountButton() {
	const { t } = useTranslation("common");
	const router = useRouter();

	const { accessToken } = useContext(UserContext);

	const [open, setOpen] = useState(false);

	const [password, setPassword] = useState("");

	const [fieldHelper, setFieldHelper] = useState("");

	const classes = useStyles();

	const deleteAccount = async () => {
		setOpen(false);

		const res = await fetch(`${host}/delete`, {
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				password,
			}),
		});

		const { error } = await res.json();
		if (error === "password-different") setFieldHelper(t(error));

		if (res.ok) {
			router.replace("/logout");
		}
	};

	return (
		<>
			<Button
				className={classes.button}
				onClick={() => setOpen(true)}
				variant="outlined"
			>
				{t("delete-account")}
			</Button>
			<Dialog onClose={() => setOpen(false)} open={open}>
				<DialogTitle></DialogTitle>
				<DialogContent>
					<DialogContentText></DialogContentText>
					<TextField
						inputProps={{ style: { textAlign: "center" } }}
						type="password"
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						label={t("password")}
						helperText={fieldHelper}
						error={fieldHelper.length > 0}
					/>
				</DialogContent>
				<DialogActions>
					<Button color="primary" onClick={() => setOpen(false)}>
						{t("cancel")}
					</Button>
					<Button autoFocus className={classes.red} onClick={deleteAccount}>
						{t("confirm")}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
export default DeleteAccountButton;
