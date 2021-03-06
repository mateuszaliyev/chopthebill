// React & Next
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Button,
	FormControl,
	IconButton,
	InputAdornment,
	TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

// IndexedDB
import { set } from "idb-keyval";

// Components
import Link from "../Link";

// Config
import { host } from "../../config";

// Contexts
import { ThemeContext } from "../Theme";
import { UserContext } from "./User";

// Styles
const useStyles = makeStyles({
	link: {
		alignSelf: "flex-start",
	},
	margin: {
		marginTop: "1rem",
	},
});

function LoginForm() {
	const { t } = useTranslation();

	const [email, setEmail] = useState("");
	const [fieldsHelper, setFieldsHelper] = useState("");
	const [password, setPassword] = useState("");
	const [visibility, setVisibility] = useState(false);

	const { setPalette, setTheme } = useContext(ThemeContext);
	const { setAccessToken, user, setUser } = useContext(UserContext);

	const router = useRouter();
	const classes = useStyles();

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

		const data = await res.json();

		if (res.ok) {
			const { accessToken, refreshToken, user } = data;

			setAccessToken(accessToken);
			await set("refresh-token", `${refreshToken}`);

			setPalette(user.theme.split("-")[1] || "light");
			setTheme(user.theme.split("-")[0] || "default");
			setUser(user);

			router.push(`${user.language}/dashboard`);
		} else if (data.error) {
			setFieldsHelper(t(`login:${data.error}`));
		}
	};

	const handleVisibility = () => {
		setVisibility((prevVisibility) => !prevVisibility);
	};

	return (
		<form autoComplete="off" onSubmit={handleSubmit}>
			<FormControl fullWidth>
				<TextField
					label="Email"
					type="email"
					onChange={(e) => setEmail(e.target.value)}
					className={classes.margin}
					error={Boolean(fieldsHelper)}
				/>

				<TextField
					className={classes.margin}
					error={Boolean(fieldsHelper)}
					helperText={fieldsHelper}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={handleVisibility} tabIndex="-1">
									{visibility ? <VisibilityOffIcon /> : <VisibilityIcon />}
								</IconButton>
							</InputAdornment>
						),
					}}
					label={t("password")}
					onChange={(e) => setPassword(e.target.value)}
					type={visibility ? "text" : "password"}
				/>

				<Button
					className={classes.margin}
					color="primary"
					type="submit"
					variant="contained"
				>
					{t("login:login")}
				</Button>
				<Link
					className={`${classes.link} ${classes.margin}`}
					href="/forgot-password"
				>
					{t("login:forgot-password")}
				</Link>
				<Link className={`${classes.link} ${classes.margin}`} href="/register">
					{t("login:have-no-account")}
				</Link>
			</FormControl>
		</form>
	);
}

export default LoginForm;
