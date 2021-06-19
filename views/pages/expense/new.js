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
import { UserContext } from "../../components/auth/User";

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

function NewExpense() {
	const { t } = useTranslation();

	const { accessToken, user } = useContext(UserContext);
	const [data, setData] = useState({
		expense: {
			amount: 0,
			currency: "XXX",
			date: new Date(),
			description: "",
			group: {
				id: null,
				name: null,
			},
			title: "",
			user: {
				id: null,
				username: null,
				avatar: false,
			},
		},
		obligations: [],
		users: [],
	});
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	const { g } = router.query;

	const theme = useTheme();
	const bplg = useMediaQuery(theme.breakpoints.up("lg"));
	const bpmd = useMediaQuery(theme.breakpoints.up("md"));
	const classes = useStyles({ bpmd, bplg });

	const authorize = async () => {
		const res = await fetch(`${host}/groups/auth/${g}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});
		if (res.ok) {
			const { id, name } = await res.json();
			setData((prevData) => ({
				...prevData,
				expense: {
					...prevData.expense,
					group: {
						id,
						name,
					},
				},
			}));
			setLoading(false);
		} else {
			router.replace("/groups");
		}
	};

	useEffect(() => {
		if (g) {
			if (accessToken) {
				authorize();
			}
		} else {
			setLoading(false);
		}
	}, [accessToken]);

	useEffect(() => {
		if (data.users.length === 0 && user.username) {
			setData((prevData) => ({
				...prevData,
				expense: {
					...prevData.expense,
					currency: user.language === "en" ? "GBP" : "PLN",
					user: {
						avatar: user.avatar,
						id: user.id,
						username: user.username,
					},
				},
				users: [
					...prevData.users,
					{
						avatar: user.avatar,
						amount: 0,
						creditor: true,
						id: user.id,
						percentage: 0,
						selected: false,
						share: 0,
						textField: {
							amount: (0).toFixed(2),
							percentage: (0).toFixed(2),
							share: 0,
						},
						username: user.username,
					},
				],
			}));
		}
	}, [user]);

	return (
		<Auth>
			<Meta title={`${t("expenses:new-expense")} | ChopTheBill`}></Meta>
			<Layout title={t("expenses:new-expense")}>
				{loading ? (
					<Loader size="4rem" />
				) : (
					<div className={classes.root}>
						<ExpenseForm
							className={classes.item}
							data={data}
							setData={setData}
						/>
						{bpmd && <Divider flexItem orientation="vertical" />}
						{user && <Expense data={data} />}
					</div>
				)}
			</Layout>
		</Auth>
	);
}

export default NewExpense;
