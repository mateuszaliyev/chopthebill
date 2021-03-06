// React & Next
import { useTranslation } from "next-i18next";

// Material UI
import { Fab, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

// Component
import Link from "../Link";

// Styles
const useStyles = makeStyles((theme) => ({
	fab: {
		bottom: theme.spacing(2),
		position: "fixed",
		right: theme.spacing(2),
	},
}));

function ExpenseAddButton({ groupId = null }) {
	const { t } = useTranslation();

	const classes = useStyles();

	return (
		<Link
			color="inherit"
			href={`/expense/new${groupId !== null ? `?g=${groupId}` : ""}`}
			underline="none"
		>
			<Tooltip title={t("expenses:new-expense")}>
				<Fab className={classes.fab} color="primary">
					<AddIcon />
				</Fab>
			</Tooltip>
		</Link>
	);
}

export default ExpenseAddButton;
