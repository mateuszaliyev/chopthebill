// React & Next
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Material UI
import {
	Container,
	IconButton,
	Paper,
	Tooltip,
	Typography,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// Components
import Link from "../../../components/Link";
import ResetPasswordForm from "../../../components/auth/ResetPasswordForm";
import Logo from "../../../components/Logo";
import Meta from "../../../components/Meta";
import Redirect from "../../../components/auth/Redirect";
import Loader from "../../../components/Loader";

// Config
import { host } from "../../../config";

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
	const { id, token } = query;
	return {
		props: {
			id,
			token,
			...(await serverSideTranslations(locale, ["common", "login"])),
		},
	};
}

function ResetPassword({ id, token }) {
	const { t } = useTranslation();
	const theme = useTheme();
	const bpsm = useMediaQuery(theme.breakpoints.up("sm"));
	const classes = useStyles();
	const router = useRouter();

	const [validated, setValidated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(async () => {
		const res = await fetch(`${host}/validate-link`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id,
				token,
			}),
		});
		const { error } = await res.json();
		setLoading(false);
		if (res.ok) {
			setValidated(true);
		} else {
			router.push(`/forgot-password?error=${error}`);
		}
	}, []);

	return validated ? (
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
						<ResetPasswordForm />
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
						<ResetPasswordForm />
					</main>
				)}
			</Container>
		</Redirect>
	) : (
		loading && <Loader size="4rem" />
	);
}

export default ResetPassword;
