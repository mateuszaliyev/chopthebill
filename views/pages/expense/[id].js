// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
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
import Loader from "../../components/Loader";
import Meta from "../../components/Meta";

// Config
import { host } from "../../config";

// Contexts
import User, { UserContext } from "../../components/auth/User";

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

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, [
				"common",
				"expenses",
				"groups",
			])),
		},
	};
}

function EditExpense() {
	const { t } = useTranslation(["common", "expenses"]);

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	const { accessToken } = useContext(UserContext);

	const router = useRouter();
	const { id } = router.query;

	const theme = useTheme();
	const bplg = useMediaQuery(theme.breakpoints.up("lg"));
	const bpmd = useMediaQuery(theme.breakpoints.up("md"));
	const classes = useStyles({ bpmd, bplg });

	const getExpense = async () => {
		const res = await fetch(`${host}/expenses/${id}`, {
			method: "GET",
			credentials: "include",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});
		if (res.ok) {
			const data = await res.json();
			setData({
				...data,
				expense: {
					...data.expense,
					date: new Date(data.expense.date),
				},
			});
			setLoading(false);
		} else {
			router.replace("/expenses");
		}
	};

	useEffect(() => {
		if (accessToken) {
			getExpense();
		}
	}, [accessToken]);

	return (
		<Auth>
			<Meta title={`${t("expenses:edit-expense")} | ChopTheBill`} />
			<Layout title={`${t("expenses:edit-expense")}`}>
				{loading ? (
					<Loader size="4rem" />
				) : (
					<div className={classes.root}>
						<ExpenseForm
							className={classes.item}
							data={data}
							edit
							setData={setData}
						/>
						{bpmd && <Divider flexItem orientation="vertical" />}
						<Expense data={data} />
					</div>
				)}
			</Layout>
		</Auth>
	);
}

export default EditExpense;
