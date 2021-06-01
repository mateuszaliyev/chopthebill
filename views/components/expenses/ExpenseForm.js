// React & Next
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Date-fns
import DateFnsUtils from "@date-io/date-fns";
import enLocale from "date-fns/locale/en-GB";
import plLocale from "date-fns/locale/pl";

// Material UI
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

// Components
import DiscardChanges from "../DiscardChanges";
import ExpenseSplit from "./ExpenseSplit";

// Currencies
import currencies from "../../config/currencies";

// Locales
const locales = {
	en: enLocale,
	pl: plLocale,
};

// Split methods
const methods = ["split-amount", "split-percentage", "split-share"];

// Styles
const useStyles = makeStyles((theme) => ({
	buttons: {
		display: "flex",
		gap: "1rem",
		justifyContent: "flex-end",
	},
	currency: {
		display: "flex",
		gap: "1rem",
	},
	currencyItem: {
		width: "calc(50% - 0.5rem)",
	},
	red: {
		border: `1px solid ${theme.palette.error.main}80`,
		color: theme.palette.error.main,
		"&:hover": {
			backgroundColor: `${theme.palette.error.main}0a`,
			border: `1px solid ${theme.palette.error.main}`,
		},
	},
	root: {
		display: "flex",
		flexDirection: "column",
		gap: "1rem",
		margin: "0 0 1rem",
		width: "100%",
	},
	search: {
		display: "flex",
	},
	searchButton: {
		marginLeft: "auto",
	},
	searchField: {
		flexGrow: "1",
		marginLeft: "1rem",
	},
	subheader: {
		...theme.typography.subtitle2,
		color: theme.palette.text.secondary,
		display: "inline-block",
	},
}));

function ExpenseForm({ className, data, setData }) {
	const { t } = useTranslation("common");

	const [discardOpen, setDiscardOpen] = useState(false);

	const router = useRouter();

	const theme = useTheme();
	const bpsm = useMediaQuery(theme.breakpoints.up("sm"));
	const classes = useStyles({ bpsm });

	const handleAmount = (e) => {
		const amount = parseInt(100 * parseFloat(e.target.value || 0));
		setData((prevData) => ({
			...prevData,
			expense: {
				...prevData.expense,
				amount,
			},
		}));
	};

	const handleCurrency = (e) => {
		setData((prevData) => ({
			...prevData,
			expense: {
				...prevData.expense,
				currency: e.target.value,
			},
		}));
	};

	const handleDate = (date) => {
		setData((prevData) => ({
			...prevData,
			expense: {
				...prevData.expense,
				date,
			},
		}));
	};

	const handleDescription = (e) => {
		setData((prevData) => ({
			...prevData,
			expense: {
				...prevData.expense,
				description: e.target.value,
			},
		}));
	};

	const handleDiscard = (value) => {
		setDiscardOpen(false);
		if (value) {
			router.push("/expenses");
		}
	};

	const handleTitle = (e) => {
		setData((prevData) => ({
			...prevData,
			expense: {
				...prevData.expense,
				title: e.target.value,
			},
		}));
	};

	useEffect(() => {
		let obligations = [];
		const sum = data.users.reduce((prev, curr) => prev + curr.amount, 0);
		if (data.users.length > 2 && 2 * data.expense.amount === sum) {
			const creditors = data.users.filter((user) => user.creditor);
			const debtors = data.users.filter((user) => !user.creditor);

			if (creditors.length > 0 && debtors.length > 0) {
				debtors.forEach((debtor) => {
					let debtorTotal = debtor.amount;
					let total = data.expense.amount;

					creditors.forEach((creditor) => {
						const percent = creditor.amount / total;
						const amount = Math.round(debtorTotal * percent);

						obligations.push({
							amount,
							creditor,
							debtor,
							settled: false,
						});

						debtorTotal -= amount;
						total -= creditor.amount;
					});
				});
			}
		}
		setData((prevData) => ({
			...prevData,
			obligations,
		}));
	}, [data.expense.amount, data.users]);

	return (
		<div className={`${className} ${classes.root}`}>
			<TextField label={t("title")} onChange={handleTitle} required />
			<TextField
				label={t("description")}
				multiline
				onChange={handleDescription}
				required
			/>
			<MuiPickersUtilsProvider
				locale={locales[router.locale]}
				utils={DateFnsUtils}
			>
				<DateTimePicker
					ampm={false}
					cancelLabel={t("cancel")}
					disableFuture
					format={
						router.locale === "en" ? "yyyy-MM-dd hh:mm a" : "yyyy-MM-dd HH:mm"
					}
					label={t("date")}
					onChange={handleDate}
					required
					showTodayButton
					todayLabel={t("today")}
					value={data.expense.date}
				/>
			</MuiPickersUtilsProvider>
			<div className={classes.currency}>
				<TextField
					className={classes.currencyItem}
					inputProps={{ min: 0, step: 0.01 }}
					label={t("amount")}
					onChange={handleAmount}
					required
					type="number"
				/>
				<FormControl className={classes.currencyItem} required>
					<InputLabel>{t("currency")}</InputLabel>
					<Select onChange={handleCurrency} value={data.expense.currency}>
						{currencies.map((currency) => (
							<MenuItem key={currency.code} value={currency.code}>
								{currency.code}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			<ExpenseSplit creditors data={data} methods={methods} setData={setData} />
			<ExpenseSplit data={data} methods={methods} setData={setData} />
			<div className={classes.buttons}>
				<Button
					className={classes.red}
					onClick={() => setDiscardOpen(true)}
					startIcon={<DeleteForeverIcon />}
					variant="outlined"
				>
					{t("discard")}
				</Button>
				<Button
					color="primary"
					startIcon={<AddAPhotoIcon />}
					variant="outlined"
				>
					{t("upload")}
				</Button>
				<Button color="primary" startIcon={<AddIcon />} variant="contained">
					{t("add")}
				</Button>
				<DiscardChanges
					onClose={handleDiscard}
					open={discardOpen}
				></DiscardChanges>
			</div>
		</div>
	);
}

export default ExpenseForm;
