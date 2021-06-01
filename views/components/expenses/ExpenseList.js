// React & Next
import { useState } from "react";

// Material UI
import { useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// Components
import ExpenseAddButton from "./ExpenseAddButton";

// Styles
const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		gap: "1rem",
		flexWrap: "wrap",
		padding: ({ bpmd }) => (bpmd ? "1rem 0 0" : "1rem 1rem 0"),
		width: "100%",
	},
}));

function ExpenseList() {
	const theme = useTheme();
	const bpmd = useMediaQuery(theme.breakpoints.up("md"));
	const classes = useStyles({ bpmd });

	return (
		<div className={classes.root}>
			<ExpenseAddButton />
		</div>
	);
}

export default ExpenseList;
