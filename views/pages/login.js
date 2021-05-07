// React & Next
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Material UI
import { Container, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import LoginForm from "../components/auth/LoginForm";
import Logo from "../components/Logo";
import Meta from "../components/Meta";
import Redirect from "../components/auth/Redirect";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "login"])),
		},
	};
}

const useStyles = makeStyles({
	paper: {
		display: "flex",
		flexDirection: "column",
		gap: "1rem",
		padding: "2rem",
		width: "100%",
	},
	root: {
		display: "grid",
		height: "100vh",
		placeItems: "center",
	},
});

function Login() {
	const { t } = useTranslation(["common", "login"]);
	const classes = useStyles();

	return (
		<Redirect>
			<Meta title={`${t("login:meta-title")} | ChopTheBill`} />
			<Container className={classes.root} maxWidth="sm">
				<Paper className={classes.paper} component="main">
					<Logo size={192} />
					<Typography align="center" variant="h4">
						ChopTheBill
					</Typography>
					<LoginForm />
				</Paper>
			</Container>
		</Redirect>
	);
}

export default Login;
