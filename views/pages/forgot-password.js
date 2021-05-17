// React & Next
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";

// Material UI
import {
	Container,
	IconButton,
	Paper,
	Tooltip,
	Typography,
	useMediaQuery,
	Snackbar,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Alert } from "@material-ui/lab";

// Components
import Link from "../components/Link";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import Logo from "../components/Logo";
import Meta from "../components/Meta";
import Redirect from "../components/auth/Redirect";

// Styles
const useStyles = makeStyles({
	back: {
		left: "1rem",
		position: "absolute",
		top: "1rem",
	},
	paper: {
		display: "flex",
		flexDirection: "column",
		gap: "1rem",
		padding: "4rem 2rem 2rem 2rem",
		position: "relative",
		width: "100%",
	},
	root: {
		display: "grid",
		height: "100vh",
		placeItems: "center",
	},
});

export async function getServerSideProps({ locale, query }) {
	const { error } = query;
	return {
		props: {
			error: error || "",
			...(await serverSideTranslations(locale, ["common", "login"])),
		},
	};
}

function ForgotPassword({ error }) {
	const { t } = useTranslation(["common", "login"]);
	const theme = useTheme();
	const bpsm = useMediaQuery(theme.breakpoints.up("sm"));
	const classes = useStyles();

	const [open, setOpen] = useState(true);

	return (
		<Redirect>
			<Meta title={`${t("login:meta-title")} | ChopTheBill`} />
			<Container className={classes.root} disableGutters={!bpsm} maxWidth="sm">
				{bpsm ? (
					<Paper className={classes.paper} component="main" elevation={24}>
						<Link color="inherit" href="/" underline="none">
							<Tooltip title={t("back")}>
								<IconButton className={classes.back}>
									<ArrowBackIcon />
								</IconButton>
							</Tooltip>
						</Link>
						<Logo background center size={192} />
						<Typography align="center" variant="h4">
							ChopTheBill
						</Typography>
						<ForgotPasswordForm onSubmit={() => setOpen(false)} />
					</Paper>
				) : (
					<main className={classes.paper}>
						<Link color="inherit" href="/" underline="none">
							<Tooltip title={t("back")}>
								<IconButton className={classes.back}>
									<ArrowBackIcon />
								</IconButton>
							</Tooltip>
						</Link>
						<Logo background center size={192} />
						<Typography align="center" variant="h4">
							ChopTheBill
						</Typography>
						<ForgotPasswordForm onSubmit={() => setOpen(false)} />
					</main>
				)}
			</Container>
			{error && (
				<Snackbar open={open}>
					<Alert severity="error" onClose={() => setOpen(false)}>
						{t(`login:${error}`)}
					</Alert>
				</Snackbar>
			)}
		</Redirect>
	);
}

export default ForgotPassword;
