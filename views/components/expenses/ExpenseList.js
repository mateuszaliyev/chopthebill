// React & Next
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

// Material UI
import { Snackbar, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

// Components
import Expense from "./Expense";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../auth/User";

// Masonry
import Masonry from "react-masonry-css";

const breakpoints = {
	816: 1,
	960: 2,
	1088: 1,
	1488: 2,
	1888: 3,
	2288: 4,
	2688: 5,
	3088: 6,
	3488: 7,
	default: 8,
};

// Styles
const useStyles = makeStyles((theme) => ({
	masonry: {
		display: "flex",
		marginLeft: "-1rem",
		width: "auto",
	},
	masonryColumn: {
		backgroundClip: "padding-box",
		paddingLeft: "1rem",
		"& > div": {
			marginBottom: "1rem",
		},
	},
	root: {
		marginBottom: ({ bpmd }) => (bpmd ? "0" : "1rem"),
		padding: ({ bpmd }) => (bpmd ? "1rem 0 0" : "1rem 1rem 0"),
		width: "100%",
	},
}));

function ExpenseList({ expenses, setExpenses }) {
	const { t } = useTranslation();

	const [snackbarSeverity, setSnackbarSeverity] = useState("info");
	const [snackbarText, setSnackbarText] = useState(null);

	const { accessToken, user } = useContext(UserContext);
	const router = useRouter();

	const theme = useTheme();
	const bpmd = useMediaQuery(theme.breakpoints.up("md"));
	const classes = useStyles({ bpmd });

	const pending = expenses.filter((data) => !data.expense.settled);
	const settled = expenses.filter((data) => data.expense.settled);

	const handleSettle = async (id) => {
		const res = await fetch(`${host}/expenses/settle/${id}`, {
			method: "PUT",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			setExpenses((prevExpenses) => {
				const index = prevExpenses.findIndex((data) => data.expense.id === id);
				const newExpenses = [...prevExpenses];
				newExpenses[index].expense.settled = true;
				return newExpenses;
			});
			setSnackbarSeverity("success");
			setSnackbarText(t("expenses:expense-settled-successfully"));
		} else {
			setSnackbarSeverity("error");
			setSnackbarText(`${t("something-went-wrong")}. ${t("try-again")}.`);
		}
	};

	return (
		<div className={classes.root}>
			<Masonry
				breakpointCols={breakpoints}
				className={classes.masonry}
				columnClassName={classes.masonryColumn}
			>
				{pending.length > 0 &&
					pending.map((data, index) => (
						<Expense
							data={data}
							key={index}
							onEdit={
								!data.expense.settled && data.expense.user?.id === user.id
									? () => router.push(`/expense/${data.expense.id}`)
									: null
							}
							onSettle={
								!data.expense.settled &&
								data.expense.user?.id === user.id &&
								data.obligations.findIndex(
									(obligation) => !obligation.settled
								) === -1
									? () => handleSettle(data.expense.id)
									: null
							}
						/>
					))}
				{settled.length > 0 &&
					settled.map((data, index) => (
						<Expense
							data={data}
							disabled
							key={index}
							onEdit={
								!data.expense.settled && data.expense.user?.id === user.id
									? () => router.push(`/expense/${data.expense.id}`)
									: null
							}
							onSettle={
								!data.expense.settled &&
								data.expense.user?.id === user.id &&
								data.obligations.findIndex(
									(obligation) => !obligation.settled
								) === -1
									? () => handleSettle(data.expense.id)
									: null
							}
						/>
					))}
			</Masonry>
			<Snackbar
				autoHideDuration={6000}
				onClose={() => setSnackbarText(null)}
				open={Boolean(snackbarText)}
			>
				<Alert
					elevation={6}
					onClose={() => setSnackbarText(null)}
					severity={snackbarSeverity}
					variant="filled"
				>
					{snackbarText}
				</Alert>
			</Snackbar>
		</div>
	);
}

export default ExpenseList;
