// React & Next
import { useContext } from "react";
import { useRouter } from "next/router";

// Material UI
import { useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// Components
import Expense from "./Expense";
import ExpenseAddButton from "./ExpenseAddButton";

// Contexts
import { UserContext } from "../auth/User";

// Styles
const useStyles = makeStyles((theme) => ({
	root: {
		alignItems: "flex-start",
		display: "flex",
		gap: "1rem",
		flexWrap: "wrap",
		marginBottom: ({ bpmd }) => (bpmd ? "0" : "1rem"),
		padding: ({ bpmd }) => (bpmd ? "1rem 0 0" : "1rem 1rem 0"),
		width: "100%",
	},
}));

function ExpenseList({ expenses, setExpenses }) {
	const { user } = useContext(UserContext);
	const router = useRouter();

	const theme = useTheme();
	const bpmd = useMediaQuery(theme.breakpoints.up("md"));
	const classes = useStyles({ bpmd });

	return (
		<div className={classes.root}>
			{expenses.length > 0 &&
				expenses.map((data, index) => (
					<Expense
						data={data}
						key={index}
						onEdit={
							user.id === data.expense.user.id
								? () => router.push(`/expense/${data.expense.id}`)
								: null
						}
					/>
				))}
			<ExpenseAddButton />
		</div>
	);
}

export default ExpenseList;
