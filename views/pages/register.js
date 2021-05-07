// React & Next
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Material UI
import { Container, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
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

function Register() {
	const { t } = useTranslation(["common", "register"]);
	const classes = useStyles();

	return (
		<Redirect>
			<Meta title={`${t("register:meta-title")} | ChopTheBill`} />
			<Container className={classes.root} maxWidth="sm">
				<Paper className={classes.paper} component="main">
					<Logo size={192} />
					<Typography align="center" variant="h4">
						ChopTheBill
					</Typography>
					<RegisterForm />
				</Paper>
			</Container>
		</Redirect>
	);
}

export default Register;
