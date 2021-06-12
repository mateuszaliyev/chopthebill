// React & Next
import { useTranslation } from "next-i18next";

// Material UI
import { Button, Divider, Typography, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// Components
import Language from "../Language";
import Logo from "../Logo";
import Link from "../Link";
import PaletteButton from "../PaletteButton";
import PaletteList from "../PaletteList";

// Hooks
import useWindowSize from "../hooks/useWindowSize";

// Styles
const useStyles = makeStyles((theme) => ({
	button: {
		fontSize: ({ bplg }) => bplg && "1.25rem",
	},
	buttons: {
		display: "flex",
		gap: "1rem",
	},
	diagonal: {
		backgroundColor: theme.palette.background.default,
		clipPath: "polygon(0 0, 100% 0, calc(100% - 100vh * 0.267) 100%, 0 100%)",
		height: "100%",
		width: "calc(50% + 100vh * 0.267 / 2)",
	},
	divider: {
		margin: "0 2rem",
	},
	heading: {
		fontFamily: '"Open Sans", "Quicksand", "Helvetica", "Arial", "sans-serif"',
		fontWeight: "700",
		marginBottom: "2rem",
		maxWidth: "15ch",
	},
	logo: {
		background: 'url("/icons/icon-no-bg.svg")',
		backgroundPosition: "50% 50%",
		backgroundRepeat: "no-repeat",
		backgroundSize: "contain",
		height: "100%",
		width: "50%",
	},
	logoSmall: {
		alignItems: "center",
		display: "flex",
	},
	main: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		justifyContent: "space-evenly",
		paddingLeft: "4rem",
		width: "calc(100% - 100vh * 0.267 / 2)",
	},
	nav: {
		alignItems: "center",
		display: "flex",
	},
	root: {
		backgroundImage: `repeating-linear-gradient(-75deg, rgba(118, 118, 118, 0.05) 0px, rgba(118, 118, 118, 0.05) 19px, rgba(59, 59, 59, 0.05) 19px, rgba(59, 59, 59, 0.05) 67px, rgba(195, 195, 195, 0.05) 67px, rgba(195, 195, 195, 0.05) 87px, rgba(121, 121, 121, 0.05) 87px, rgba(121, 121, 121, 0.05) 133px, rgba(250, 250, 250, 0.05) 133px, rgba(250, 250, 250, 0.05) 172px, rgba(106, 106, 106, 0.05) 172px, rgba(106, 106, 106, 0.05) 197px, rgba(151, 151, 151, 0.05) 197px, rgba(151, 151, 151, 0.05) 226px, rgba(219, 219, 219, 0.05) 226px, rgba(219, 219, 219, 0.05) 260px), repeating-linear-gradient(-75deg, rgba(70, 70, 70, 0.05) 0px, rgba(70, 70, 70, 0.05) 40px, rgba(220, 220, 220, 0.05) 40px, rgba(220, 220, 220, 0.05) 79px, rgba(95, 95, 95, 0.05) 79px, rgba(95, 95, 95, 0.05) 103px, rgba(15, 15, 15, 0.05) 103px, rgba(15, 15, 15, 0.05) 148px, rgba(51, 51, 51, 0.05) 148px, rgba(51, 51, 51, 0.05) 186px, rgba(225, 225, 225, 0.05) 186px, rgba(225, 225, 225, 0.05) 202px, rgba(60, 60, 60, 0.05) 202px, rgba(60, 60, 60, 0.05) 239px, rgba(67, 67, 67, 0.05) 239px, rgba(67, 67, 67, 0.05) 259px), repeating-linear-gradient(-75deg, rgba(146, 146, 146, 0.05) 0px, rgba(146, 146, 146, 0.05) 40px, rgba(166, 166, 166, 0.05) 40px, rgba(166, 166, 166, 0.05) 54px, rgba(156, 156, 156, 0.05) 54px, rgba(156, 156, 156, 0.05) 71px, rgba(134, 134, 134, 0.05) 71px, rgba(134, 134, 134, 0.05) 95px, rgba(77, 77, 77, 0.05) 95px, rgba(77, 77, 77, 0.05) 111px, rgba(26, 26, 26, 0.05) 111px, rgba(26, 26, 26, 0.05) 153px, rgba(46, 46, 46, 0.05) 153px, rgba(46, 46, 46, 0.05) 202px, rgba(197, 197, 197, 0.05) 202px, rgba(197, 197, 197, 0.05) 216px),linear-gradient(195deg, rgb(76, 175, 80), rgb(0, 150, 136))`,
		display: "flex",
		flexDirection: "column",
		height: "100vh",
		width: "100%",
	},
	shadow: {
		display: "flex",
		filter:
			"drop-shadow(11px 0px 15px rgba(0, 0, 0, 0.2)) drop-shadow(24px 0px 38px rgba(0, 0, 0, 0.14)) drop-shadow(9px 0px 46px rgba(0, 0, 0, 0.12))",
		flexGrow: "1",
		width: "100%",
	},
	text: {
		maxWidth: ({ bplg }) => (bplg ? "40ch" : "35ch"),
	},
	wordmark: {
		marginLeft: "1rem",
	},
}));

function HomeDesktop() {
	const { t } = useTranslation(["common", "landing-page"]);
	const { width } = useWindowSize();

	const theme = useTheme();
	const bplg = useMediaQuery(theme.breakpoints.up("lg"));
	const classes = useStyles({ bplg });

	const variant = {
		heading: bplg ? "h2" : "h3",
		text: bplg ? "h6" : "body1",
	};

	return (
		<div className={classes.root}>
			<div className={classes.shadow}>
				<div className={classes.diagonal}>
					<main className={classes.main}>
						<nav className={classes.nav}>
							<div className={classes.logoSmall}>
								<Logo background size={48} />
								<Typography className={classes.wordmark} variant="h5">
									ChopTheBill
								</Typography>
							</div>
							<Divider
								className={classes.divider}
								flexItem
								orientation="vertical"
							/>
							{width >= 1600 ? (
								<>
									<Language expand />
									<PaletteList expand />
									<PaletteButton />
								</>
							) : bplg ? (
								<>
									<Language />
									<PaletteList />
									<PaletteButton />
								</>
							) : (
								<>
									<Language size="small" />
									<PaletteList size="small" />
									<PaletteButton size="small" />
								</>
							)}
						</nav>
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
								{`${t("landing-page:description")} ${t(
									"landing-page:description-extended"
								)}`}
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
						<Typography>
							&copy; ChopTheBill {new Date().getFullYear()}
						</Typography>
					</main>
				</div>
				<div className={classes.logo} />
			</div>
		</div>
	);
}

export default HomeDesktop;
