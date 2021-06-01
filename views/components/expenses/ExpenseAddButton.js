// React & Next
import { useTranslation } from "next-i18next";

// Material UI
import {
	ButtonBase,
	Card,
	Fab,
	Tooltip,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

// Component
import Link from "../Link";

// Styles
const useStyles = makeStyles((theme) => ({
	button: {
		height: "100%",
		width: "100%",
	},
	card: {
		display: "grid",
		height: "100%",
		placeItems: "center",
		width: "100%",
	},
	fab: {
		bottom: theme.spacing(2),
		position: "fixed",
		right: theme.spacing(2),
	},
	icon: {
		color: theme.palette.grey[500],
		fontSize: "8rem",
	},
	link: {
		height: "24rem",
		maxWidth: "20rem",
		width: "100%",
	},
}));

function ExpenseAddButton() {
	const { t } = useTranslation("common");

	const classes = useStyles();
	const theme = useTheme();
	const bpmd = useMediaQuery(theme.breakpoints.up("md"));

	return bpmd ? (
		<Link className={classes.link} color="inherit" href="/expense/new">
			<ButtonBase className={classes.button}>
				<Card className={classes.card}>
					<AddIcon className={classes.icon} />
				</Card>
			</ButtonBase>
		</Link>
	) : (
		<Link color="inherit" href="/expense/new">
			<Tooltip title={t("add")}>
				<Fab className={classes.fab} color="primary">
					<AddIcon />
				</Fab>
			</Tooltip>
		</Link>
	);
}

export default ExpenseAddButton;
