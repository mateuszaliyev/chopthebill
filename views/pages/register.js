// React & Next
import { useContext } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Material UI
import {
	Container,
	IconButton,
	Paper,
	Tooltip,
	Typography,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// Components
import Link from "../components/Link";
import Logo from "../components/Logo";
import Meta from "../components/Meta";
import RegisterForm from "../components/auth/RegisterForm";
import Redirect from "../components/auth/Redirect";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "register"])),
		},
	};
}

// Contexts
import { ThemeContext } from "../components/Theme";

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

function Register() {
	const { t } = useTranslation(["common", "register"]);
	const { muiTheme } = useContext(ThemeContext);
	const bpsm = useMediaQuery(muiTheme.breakpoints.up("sm"));
	const classes = useStyles();

	return (
		<Redirect>
			<Meta title={`${t("register:meta-title")} | ChopTheBill`} />
			<Container className={classes.root} disableGutters={!bpsm} maxWidth="sm">
				{bpsm ? (
					<Paper className={classes.paper} component="main">
						<Link color="inherit" href="/" underline="none">
							<Tooltip title={t("back")}>
								<IconButton className={classes.back}>
									<ArrowBackIcon />
								</IconButton>
							</Tooltip>
						</Link>
						<Logo size={192} />
						<Typography align="center" variant="h4">
							ChopTheBill
						</Typography>
						<RegisterForm />
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
						<Logo size={192} />
						<Typography align="center" variant="h4">
							ChopTheBill
						</Typography>
						<RegisterForm />
					</main>
				)}
			</Container>
		</Redirect>
	);
}

export default Register;
