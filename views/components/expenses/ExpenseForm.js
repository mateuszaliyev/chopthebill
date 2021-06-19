// React & Next
import { useContext, useEffect, useState } from "react";
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
	Snackbar,
	TextField,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SaveIcon from "@material-ui/icons/Save";

// Components
import DiscardChanges from "../DiscardChanges";
import ExpenseSplit from "./ExpenseSplit";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../auth/User";

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
	buttons: ({ bpsm }) => ({
		display: "flex",
		flexDirection: bpsm ? "row" : "column",
		gap: "1rem",
		justifyContent: "flex-end",
	}),
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
			backgroundColor: `${theme.palette.error.main}${parseInt(
				255 * theme.palette.action.hoverOpacity
			)
				.toString(16)
				.padStart(2, "0")}`,
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

function ExpenseForm({ className, data, edit = false, setData }) {
	const { t } = useTranslation();

	const [discardOpen, setDiscardOpen] = useState(false);
	const [helperText, setHelperText] = useState({
		title: null,
		description: null,
	});
	const [snackbarSeverity, setSnackbarSeverity] = useState("error");
	const [snackbarText, setSnackbarText] = useState(null);

	const { accessToken } = useContext(UserContext);
	const router = useRouter();
	const { id } = router.query;

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

	const handleErrorSnackbar = () => {
		setSnackbarSeverity("error");
		setSnackbarText(`${t("something-went-wrong")}. ${t("try-again")}.`);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			data.users.filter((user) => user.id === data.expense.user.id).length === 0
		) {
			setSnackbarSeverity("warning");
			setSnackbarText("User that created the expense must be involved.");
			return;
		}

		if (isSubmittable()) {
			const submittedData = {
				expense: {
					...data.expense,
					...(id && { id }),
					group: data.expense.group.id,
					user: data.expense.user.id,
				},
				obligations: data.obligations.map((obligation) => ({
					amount: obligation.amount,
					creditor: obligation.creditor.id,
					debtor: obligation.debtor.id,
				})),
			};

			const res = await fetch(
				edit ? `${host}/expenses/${id}` : `${host}/expenses`,
				{
					method: edit ? "PUT" : "POST",
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(submittedData),
				}
			);

			if (res.ok) {
				router.push("/expenses");
			} else if (res.status < 500) {
				const error = await res.json();
				if (error.length > 0) {
					error.forEach((err) => {
						const key = err.split("-")[0];
						setHelperText((prevHelperText) => ({
							...prevHelperText,
							[key]: t(`expenses:${err}`),
						}));
					});
				} else {
					handleErrorSnackbar();
				}
			} else {
				handleErrorSnackbar();
			}
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

	const isSubmittable = () => {
		return Boolean(
			data.users.length >= 2 &&
				2 * data.expense.amount ===
					data.users.reduce((prev, curr) => prev + curr.amount, 0)
		);
	};

	useEffect(() => {
		let obligations = [];
		const sum = data.users.reduce((prev, curr) => prev + curr.amount, 0);
		if (data.users.length >= 2 && 2 * data.expense.amount === sum) {
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
		<>
			<form
				className={`${className} ${classes.root}`}
				onSubmit={(e) => e.preventDefault()}
			>
				<TextField
					error={Boolean(helperText.title)}
					helperText={helperText.title}
					label={t("title")}
					onChange={handleTitle}
					required
					value={data.expense.title}
				/>
				<TextField
					error={Boolean(helperText.description)}
					helperText={helperText.description}
					label={t("description")}
					multiline
					onChange={handleDescription}
					value={data.expense.description}
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
						value={data.expense.amount / 100 || ""}
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
				{data.expense.amount > 0 && (
					<>
						<ExpenseSplit
							creditors
							data={data}
							methods={methods}
							setData={setData}
						/>
						<ExpenseSplit data={data} methods={methods} setData={setData} />
					</>
				)}
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
						{t("upload-photo")}
					</Button>
					<Button
						color="primary"
						disabled={(() => !isSubmittable())()}
						onClick={handleSubmit}
						startIcon={edit ? <SaveIcon /> : <AddIcon />}
						variant="contained"
					>
						{t(edit ? "expenses:save-expense" : "expenses:create-expense")}
					</Button>
					<DiscardChanges
						onClose={handleDiscard}
						open={discardOpen}
					></DiscardChanges>
				</div>
			</form>
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
		</>
	);
}

export default ExpenseForm;
