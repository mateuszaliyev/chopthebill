// React & Next
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Auth from "../components/auth/Auth";
import ExpenseList from "../components/expenses/ExpenseList";
import Layout from "../components/layout/Layout";
import Meta from "../components/Meta";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "expenses"])),
		},
	};
}

function Expenses() {
	const { t } = useTranslation("common");

	return (
		<Auth>
			<Meta title={`${t("expenses")} | ChopTheBill`} />
			<Layout title={`${t("expenses")}`}>
				<ExpenseList />
			</Layout>
		</Auth>
	);
}

export default Expenses;
