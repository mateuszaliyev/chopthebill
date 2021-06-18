// React & Next
import { useContext } from "react";
import { useRouter } from "next/router";

// Material UI
import { useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// Components
import Expense from "./Expense";

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

function ExpenseList({ expenses }) {
	const { user } = useContext(UserContext);
	const router = useRouter();

	const theme = useTheme();
	const bpmd = useMediaQuery(theme.breakpoints.up("md"));
	const classes = useStyles({ bpmd });

	return (
		<div className={classes.root}>
			<Masonry
				breakpointCols={breakpoints}
				className={classes.masonry}
				columnClassName={classes.masonryColumn}
			>
				{expenses.length > 0 &&
					expenses.map((data, index) => (
						<Expense
							data={data}
							key={index}
							onEdit={
								user.id === data.expense.user?.id
									? () => router.push(`/expense/${data.expense.id}`)
									: null
							}
						/>
					))}
			</Masonry>
		</div>
	);
}

export default ExpenseList;
