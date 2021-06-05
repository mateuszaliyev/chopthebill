// React & Next
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Material UI
import { Divider, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// Components
import Auth from "../../components/auth/Auth";
import Expense from "../../components/expenses/Expense";
import ExpenseForm from "../../components/expenses/ExpenseForm";
import Layout from "../../components/layout/Layout";
import Meta from "../../components/Meta";

// Contexts
import { UserContext } from "../../components/auth/User";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "expenses"])),
		},
	};
}

// Styles
const useStyles = makeStyles((theme) => ({
	item: {
		flexGrow: "1",
	},
	root: ({ bplg, bpmd }) => ({
		alignItems: bplg ? "start" : "center",
		display: "flex",
		flexDirection: bplg ? "row" : "column",
		gap: "1rem",
		justifyContent: "center",
		padding: bpmd ? "1rem 0 0" : "1rem 1rem 0",
		width: "100%",
	}),
}));

function NewExpense() {
	const { t } = useTranslation("common");

	const { user } = useContext(UserContext);
	const [data, setData] = useState({
		expense: {
			amount: 0,
			currency: "XXX",
			date: new Date(),
			description: "",
			idGroup: null,
			user: null,
			title: "",
		},
		obligations: [],
		users: [],
	});

	const theme = useTheme();
	const bplg = useMediaQuery(theme.breakpoints.up("lg"));
	const bpmd = useMediaQuery(theme.breakpoints.up("md"));
	const classes = useStyles({ bpmd, bplg });

	useEffect(() => {
		if (user) {
			setData((prevData) => ({
				...prevData,
				expense: {
					...prevData.expense,
					currency: user.language === "en" ? "GBP" : "PLN",
					user,
				},
			}));
		}
	}, [user]);

	return (
		<Auth>
			<Meta title={`${t("new-expense")} | ChopTheBill`}></Meta>
			<Layout title={t("new-expense")}>
				<div className={classes.root}>
					<ExpenseForm className={classes.item} data={data} setData={setData} />
					{bpmd && <Divider flexItem orientation="vertical" />}
					{user && <Expense data={data} />}
				</div>
			</Layout>
		</Auth>
	);
}

export default NewExpense;
