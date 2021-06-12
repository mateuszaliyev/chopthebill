// React & Next
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Auth from "../components/auth/Auth";
import Empty from "../components/Empty";
import ExpenseAddButton from "../components/expenses/ExpenseAddButton";
import ExpenseList from "../components/expenses/ExpenseList";
import Layout from "../components/layout/Layout";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

// Config
import { host } from "../config";

// Contexts
import { UserContext } from "../components/auth/User";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "expenses"])),
		},
	};
}

function Expenses() {
	const { t } = useTranslation("common");

	const [expenses, setExpenses] = useState([]);
	const [loading, setLoading] = useState(true);

	const { accessToken } = useContext(UserContext);

	const getExpenses = async () => {
		const res = await fetch(`${host}/expenses`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});
		if (res.ok) {
			const expenses = await res.json();
			setExpenses(
				expenses.map((expense) => ({
					...expense,
					expense: {
						...expense.expense,
						date: new Date(expense.expense.date),
					},
				}))
			);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (accessToken) {
			getExpenses();
		}
	}, [accessToken]);

	return (
		<Auth>
			<Meta title={`${t("expenses")} | ChopTheBill`} />
			<Layout title={`${t("expenses")}`}>
				{loading ? (
					<Loader size="4rem" />
				) : (
					<>
						{expenses.length === 0 && <Empty />}
						<ExpenseList expenses={expenses} setExpenses={setExpenses} />
						<ExpenseAddButton />
					</>
				)}
			</Layout>
		</Auth>
	);
}

export default Expenses;
