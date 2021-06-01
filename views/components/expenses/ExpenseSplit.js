// React & Next
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
	AppBar,
	Button,
	IconButton,
	Paper,
	Tab,
	Tabs,
	Toolbar,
	Tooltip,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import HorizontalSplitIcon from "@material-ui/icons/HorizontalSplit";

// Components
import ExpenseSplitList from "./ExpenseSplitList";
import SearchDialog from "../layout/SearchDialog";

// Contexts
import { ThemeContext } from "../Theme";

// Hooks
import useWindowSize from "../hooks/useWindowSize";

// Styles
const useStyles = makeStyles((theme) => ({
	button: {
		marginLeft: "auto",
	},
	root: {
		margin: "1rem 0 0",
	},
	tab: {
		minWidth: ({ bpsm }) => bpsm && "8rem",
	},
	tabDark: {
		backgroundColor: theme.palette.grey[600],
	},
}));

function TabPanel({ children, index, value }) {
	return <div hidden={value !== index}>{value === index && children}</div>;
}

function ExpenseSplit({ creditors = false, data, methods, setData }) {
	const { t } = useTranslation(["common", "expenses"]);

	const [searchDialogOpen, setSearchDialogOpen] = useState(false);
	const [selectedAll, setSelectedAll] = useState(false);
	const [value, setValue] = useState(0);

	const { width } = useWindowSize();
	const bpxl = width >= 480;
	const bpsm = width >= 600;
	const classes = useStyles({ bpsm });

	const { palette } = useContext(ThemeContext);

	const handleChange = (e, newValue) => {
		setValue(newValue);
	};

	const handleEqualSplit = () => {
		let index = 0,
			sum = data.expense.amount;
		const usersOfKind = data.users.filter(
			(user) => creditors === user.creditor
		);
		const newUsers = data.users.map((user) => {
			if (creditors === user.creditor) {
				const amount = sum / (usersOfKind.length - index);
				const newUser = {
					...user,
					amount,
					percentage: 100 * (amount / data.expense.amount),
					share: 1,
					textField: {
						amount: (amount / 100).toFixed(2),
						percentage: (100 * amount) / data.expense.amount,
						share: 1,
					},
				};
				index++;
				sum -= newUser.amount;
				return newUser;
			}
			return user;
		});
		setData((prevData) => ({
			...prevData,
			users: newUsers,
		}));
	};

	const handleSearchDialogClose = (user) => {
		if (user) {
			let exists = false;

			for (const u of data.users) {
				if (user.id === u.id) {
					exists = true;
					break;
				}
			}

			if (!exists) {
				setData((prevData) => ({
					...prevData,
					users: [
						...prevData.users,
						{
							...user,
							amount: 0,
							creditor: creditors,
							percentage: 0,
							selected: false,
							share: 0,
							textField: {
								amount: (0).toFixed(2),
								percentage: (0).toFixed(2),
								share: 0,
							},
						},
					],
				}));
			}
		}
		setSearchDialogOpen(false);
	};

	useEffect(() => {
		window.dispatchEvent(new CustomEvent("resize"));
	}, []);

	return (
		<Paper className={classes.root}>
			<AppBar
				className={palette !== "light" && classes.tabDark}
				color="primary"
				position="static"
			>
				<Toolbar>
					<Typography variant="h6">
						{t(creditors ? "expenses:creditors" : "expenses:debtors")}
					</Typography>
					{bpxl ? (
						<Button
							color="inherit"
							className={classes.button}
							onClick={handleEqualSplit}
							startIcon={<HorizontalSplitIcon />}
						>
							{t("expenses:equal-split")}
						</Button>
					) : (
						<Tooltip title={t("expenses:equal-split")}>
							<IconButton
								color="inherit"
								className={classes.button}
								edge="end"
								onClick={handleEqualSplit}
							>
								<HorizontalSplitIcon />
							</IconButton>
						</Tooltip>
					)}
				</Toolbar>
				<Tabs
					onChange={handleChange}
					scrollButtons={bpxl ? "off" : "on"}
					TabIndicatorProps={{ style: { backgroundColor: "#fff" } }}
					value={value}
					variant={bpxl ? "fullWidth" : "scrollable"}
				>
					{methods.map((method) => (
						<Tab
							className={classes.tab}
							key={method}
							label={t(`expenses:${method}`)}
						/>
					))}
				</Tabs>
			</AppBar>
			{methods.map((method, index) => (
				<TabPanel index={index} key={method} value={value}>
					<ExpenseSplitList
						creditors={creditors}
						data={data}
						method={method}
						onUserAdd={() => setSearchDialogOpen(true)}
						selectedAll={selectedAll}
						setData={setData}
						setSelectedAll={setSelectedAll}
					/>
				</TabPanel>
			))}
			<SearchDialog
				onClose={handleSearchDialogClose}
				open={searchDialogOpen}
				placeholder={t("search-users")}
				title={t("add-user")}
			/>
		</Paper>
	);
}

export default ExpenseSplit;