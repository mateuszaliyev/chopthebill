// React & Next
import { useTranslation } from "next-i18next";

// Material UI
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Components
import Link from "../Link";
import Logo from "../Logo";

// Hooks
import useWindowSize from "../hooks/useWindowSize";

// Styles
const useStyles = makeStyles((theme) => ({
	button: {
		fontSize: ({ height, width }) =>
			height >= 1024 || width >= 1024 ? "1.25rem" : "1rem",
	},
	buttons: {
		display: "flex",
		flexWrap: "wrap",
		gap: "1rem",
		justifyContent: "center",
		margin: "2rem 0",
	},
	heading: {
		fontFamily: '"Open Sans", "Quicksand", "Helvetica", "Arial", "sans-serif"',
		fontWeight: "700",
		marginBottom: "1rem",
		maxWidth: "15ch",
	},
	logo: {
		backgroundSize: "contain",
	},
	logoContainer: {
		alignItems: "center",
		backgroundImage: `repeating-linear-gradient(-75deg, rgba(118, 118, 118, 0.05) 0px, rgba(118, 118, 118, 0.05) 19px, rgba(59, 59, 59, 0.05) 19px, rgba(59, 59, 59, 0.05) 67px, rgba(195, 195, 195, 0.05) 67px, rgba(195, 195, 195, 0.05) 87px, rgba(121, 121, 121, 0.05) 87px, rgba(121, 121, 121, 0.05) 133px, rgba(250, 250, 250, 0.05) 133px, rgba(250, 250, 250, 0.05) 172px, rgba(106, 106, 106, 0.05) 172px, rgba(106, 106, 106, 0.05) 197px, rgba(151, 151, 151, 0.05) 197px, rgba(151, 151, 151, 0.05) 226px, rgba(219, 219, 219, 0.05) 226px, rgba(219, 219, 219, 0.05) 260px), repeating-linear-gradient(-75deg, rgba(70, 70, 70, 0.05) 0px, rgba(70, 70, 70, 0.05) 40px, rgba(220, 220, 220, 0.05) 40px, rgba(220, 220, 220, 0.05) 79px, rgba(95, 95, 95, 0.05) 79px, rgba(95, 95, 95, 0.05) 103px, rgba(15, 15, 15, 0.05) 103px, rgba(15, 15, 15, 0.05) 148px, rgba(51, 51, 51, 0.05) 148px, rgba(51, 51, 51, 0.05) 186px, rgba(225, 225, 225, 0.05) 186px, rgba(225, 225, 225, 0.05) 202px, rgba(60, 60, 60, 0.05) 202px, rgba(60, 60, 60, 0.05) 239px, rgba(67, 67, 67, 0.05) 239px, rgba(67, 67, 67, 0.05) 259px), repeating-linear-gradient(-75deg, rgba(146, 146, 146, 0.05) 0px, rgba(146, 146, 146, 0.05) 40px, rgba(166, 166, 166, 0.05) 40px, rgba(166, 166, 166, 0.05) 54px, rgba(156, 156, 156, 0.05) 54px, rgba(156, 156, 156, 0.05) 71px, rgba(134, 134, 134, 0.05) 71px, rgba(134, 134, 134, 0.05) 95px, rgba(77, 77, 77, 0.05) 95px, rgba(77, 77, 77, 0.05) 111px, rgba(26, 26, 26, 0.05) 111px, rgba(26, 26, 26, 0.05) 153px, rgba(46, 46, 46, 0.05) 153px, rgba(46, 46, 46, 0.05) 202px, rgba(197, 197, 197, 0.05) 202px, rgba(197, 197, 197, 0.05) 216px),linear-gradient(195deg, rgb(76,175,80), rgb(0,150,136))`,
		color: "#fff",
		display: "flex",
		flexDirection: ({ height, width }) =>
			width / height >= 1 ? "row" : "column",
		height: "50vh",
		justifyContent: "center",
		padding: "0 0 1rem",
	},
	main: {
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		flexGrow: "1",
		justifyContent: "space-around",
		padding: "1rem",
	},
	root: {
		display: "flex",
		flexDirection: "column",
		minHeight: "100vh",
		width: "100%",
	},
	text: {
		maxWidth: "40ch",
	},
}));

function HomeMobile() {
	const { t } = useTranslation();

	const { height, width } = useWindowSize();
	const classes = useStyles({ height, width });

	const variant = {
		heading:
			height >= 1024 && width >= 1024
				? "h2"
				: height > 720 && width > 720
				? "h3"
				: "h4",
		text: height >= 1024 && width >= 1024 ? "h5" : "h6",
		wordmark: height > 720 && width > 720 ? "h3" : "h4",
	};

	return (
		<div className={classes.root}>
			<div className={classes.logoContainer}>
				<Logo className={classes.logo} size="40vh" />
				<Typography variant={variant.wordmark}>ChopTheBill</Typography>
			</div>
			<main className={classes.main}>
				<div>
					<Typography
						className={classes.heading}
						color="primary"
						variant={variant.heading}
					>
						{t("landing-page:slogan")}
					</Typography>
					<Typography
						className={classes.text}
						color="textSecondary"
						variant={variant.text}
					>
						{t("landing-page:description-extended")}
					</Typography>
				</div>
				<div className={classes.buttons}>
					<Link href="/login" underline="none">
						<Button className={classes.button} color="primary" size="large">
							{t("login")}
						</Button>
					</Link>
					<Link href="/register" underline="none">
						<Button
							className={classes.button}
							color="primary"
							size="large"
							variant="contained"
						>
							{t("register")}
						</Button>
					</Link>
				</div>
				<Typography align="center">
					&copy; ChopTheBill {new Date().getFullYear()}
				</Typography>
			</main>
		</div>
	);
}

export default HomeMobile;
