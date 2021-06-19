// React & Next
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Material UI
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloudOffIcon from "@material-ui/icons/CloudOff";
import RefreshIcon from "@material-ui/icons/Refresh";
import RestoreIcon from "@material-ui/icons/Restore";

// Components
import Meta from "../components/Meta";

// Hooks
import useWindowSize from "../components/hooks/useWindowSize";

// Styles
const useStyles = makeStyles((theme) => ({
	buttons: {
		display: "flex",
		gap: "1rem",
		justifyContent: ({ width }) => (width >= 960 ? "flex-start" : "center"),
		marginTop: "1rem",
	},
	icon: {
		fontSize: ({ width }) => (width >= 480 ? "16rem" : "12rem"),
	},
	root: {
		alignItems: "center",
		display: "flex",
		flexDirection: ({ width }) => (width >= 960 ? "row" : "column"),
		height: "100vh",
		gap: ({ width }) => (width >= 960 ? "4rem" : "1rem"),
		justifyContent: "center",
		padding: "1rem",
		width: "100vw",
	},
	text: {
		display: "flex",
		gap: "1rem",
		flexDirection: "column",
		maxWidth: "50ch",
	},
}));

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"])),
		},
	};
}

function Offline() {
	const { t } = useTranslation();

	const router = useRouter();

	const { width } = useWindowSize();
	const classes = useStyles({ width });

	return (
		<>
			<Meta title={`${t("offline")} | ChopTheBill`} />
			<main className={classes.root}>
				<CloudOffIcon color="primary" className={classes.icon} />
				<div className={classes.text}>
					<Typography
						align={width >= 960 ? "left" : "center"}
						color="textPrimary"
						component="h1"
						variant={width >= 480 ? "h3" : "h4"}
					>
						{t("offline")}
					</Typography>
					<Typography
						align={width >= 960 ? "left" : "center"}
						color="textSecondary"
						component="h2"
						variant={width >= 480 ? "h5" : "h6"}
					>
						{t("offline-details")}
					</Typography>
					<div className={classes.buttons}>
						<Button
							color="primary"
							onClick={() => router.reload()}
							startIcon={<RefreshIcon />}
							variant="contained"
						>
							{t("retry-refresh")}
						</Button>
						<Button
							color="primary"
							onClick={() => router.back()}
							startIcon={<RestoreIcon />}
						>
							{t("back")}
						</Button>
					</div>
				</div>
			</main>
		</>
	);
}

export default Offline;
