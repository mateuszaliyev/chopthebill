// React & Next
import { useState } from "react";

// Material UI
import { ButtonBase, Fab, Tooltip, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

// Components
// import Expense from "./Expense";
import Link from "../Link";

// Styles
const useStyles = makeStyles((theme) => ({
	fab: {
		bottom: theme.spacing(2),
		position: "fixed",
		right: theme.spacing(2),
	},
	root: {
		display: "flex",
		gap: "1rem",
		flexWrap: "wrap",
		justifyContent: "center",
		padding: ({ bpmd }) => (bpmd ? "1rem 0 0" : "1rem 1rem 0"),
		width: "100%",
	},
}));

function ExpenseList() {
	const [open, setOpen] = useState(false);

	const theme = useTheme();
	const bpmd = useMediaQuery(theme.breakpoints.up("md"));
	const classes = useStyles({ bpmd });

	const addExpense = () => {
		setOpen(true);
	};

	return (
		<div className={classes.root}>
			{/* <Expense />
			<Expense />
			<Expense />
			<Expense />
			{bpmd ? (
				<Link color="inherit" href="/expense/new" underline="none">
					<ButtonBase onClick={addExpense}>
						<Expense add></Expense>
					</ButtonBase>
				</Link>
			) : (
				<Tooltip title="Add">
					<Link color="inherit" href="/expense/new" underline="none">
						<Fab className={classes.fab} color="primary">
							<AddIcon />
						</Fab>
					</Link>
				</Tooltip>
			)} */}
		</div>
	);
}

export default ExpenseList;
