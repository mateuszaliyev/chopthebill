// React & Next
import { useTranslation } from "next-i18next";

// Material UI
import {
	Avatar as MuiAvatar,
	Button,
	Checkbox,
	Collapse,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemIcon,
	ListItemText,
	TextField,
	Tooltip,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RemoveIcon from "@material-ui/icons/Remove";

// Components
import Avatar from "../Avatar";
import Currency from "./Currency";

// Hooks
import useWindowSize from "../hooks/useWindowSize";

// Styles
const useStyles = makeStyles((theme) => ({
	expand: {
		transform: "rotate(0deg)",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expanded: {
		transform: "rotate(180deg)",
	},
	primary: {
		color: theme.palette.primary.main,
	},
	red: {
		color: theme.palette.error.main,
	},
	textField: {
		maxWidth: "7rem",
		minWidth: "7rem",
	},
}));

function ExpenseSplitList({
	creditors,
	data,
	method,
	onUserAdd,
	selectedAll,
	setData,
	setSelectedAll,
}) {
	const { t } = useTranslation(["common", "expenses"]);

	const { width } = useWindowSize();
	const bpxl = width >= 480;
	const bpsm = width >= 600;
	const classes = useStyles({ bpsm });

	const differenceAmount = () => data.expense.amount - totalAmount();

	const handleDelete = () => {
		const newUsers = data.users.filter(
			(user) =>
				(creditors === user.creditor && !user.selected) ||
				creditors !== user.creditor
		);
		setSelectedAll(false);
		setData((prevData) => ({
			...prevData,
			users: newUsers,
		}));
	};

	const handleDeleteIndex = (userIndex) => {
		const newUsers = data.users.filter((user, index) => userIndex !== index);
		setSelectedAll(false);
		setData((prevData) => ({
			...prevData,
			users: newUsers,
		}));
	};

	const handleInputAmount = (id, amountField) => {
		const amount = parseFloat(amountField || 0);
		const users = data.users.map((user) => {
			if (user.id === id) {
				return {
					...user,
					amount,
					percentage: (100 * amount) / data.expense.amount,
				};
			}
			return user;
		});
		setData((prevData) => ({
			...prevData,
			users,
		}));
	};

	const handleInputPercentage = (id, percentageField) => {
		const percentage = parseFloat(percentageField || 0);
		const users = data.users.map((user) => {
			if (user.id === id) {
				return {
					...user,
					amount: (data.expense.amount * percentage) / 100,
					percentage,
				};
			}
			return user;
		});
		setData((prevData) => ({
			...prevData,
			users,
		}));
	};

	const handleInputShare = (id, shareField) => {
		const share = parseInt(shareField || 0);
		let shareSum = data.users.reduce((prev, curr) => {
			if (creditors === curr.creditor) {
				return curr.id === id ? prev + share : prev + curr.share;
			} else {
				return prev;
			}
		}, 0);

		let sum = data.expense.amount;

		const users = data.users.map((user) => {
			if (creditors === user.creditor) {
				const amount = (
					(sum * (user.id === id ? share : user.share)) /
					shareSum
				).toFixed(2);
				const newUser = {
					...user,
					amount,
					percentage: (100 * amount) / data.expense.amount,
					share: user.id === id ? share : user.share,
				};
				sum -= amount;
				shareSum -= newUser.share;
				return newUser;
			}
			return user;
		});
		setData((prevData) => ({
			...prevData,
			users,
		}));
	};

	const handleMove = () => {
		const newUsers = data.users.map((user) =>
			user.selected && creditors === user.creditor
				? { ...user, creditor: !creditors, selected: false }
				: user
		);
		setSelectedAll(false);
		setData((prevData) => ({
			...prevData,
			users: newUsers,
		}));
	};

	const handleMoveIndex = (userIndex) => {
		const newUsers = data.users.map((user, index) =>
			userIndex === index
				? { ...user, creditor: !creditors, selected: false }
				: user
		);
		setSelectedAll(false);
		setData((prevData) => ({
			...prevData,
			users: newUsers,
		}));
	};

	const handleSelect = (index, value) => {
		let newUsers = [...data.users];
		const newUser = {
			...data.users[index],
			selected: value,
		};
		newUsers[index] = newUser;
		if (
			newUsers.filter((user) => creditors === user.creditor && !user.selected)
				.length === 0
		) {
			setSelectedAll(true);
		} else {
			setSelectedAll(false);
		}
		setData((prevData) => ({
			...prevData,
			users: newUsers,
		}));
	};

	const handleSelectAll = (value) => {
		const newUsers = data.users.map((user) => {
			if (creditors === user.creditor) {
				return { ...user, selected: value };
			}
			return user;
		});
		setSelectedAll(value);
		setData((prevData) => ({
			...prevData,
			users: newUsers,
		}));
	};

	const totalAmount = () => {
		let sum = 0;
		data.users.forEach((user) =>
			creditors === user.creditor ? (sum += parseFloat(user.amount || 0)) : 0
		);
		return parseFloat(sum).toFixed(2);
	};

	return (
		<List dense={!bpxl}>
			{bpxl &&
				data.users.filter((user) => creditors === user.creditor).length > 0 && (
					<ListItem divider>
						<ListItemIcon>
							<Tooltip title="Select all">
								<Checkbox
									checked={selectedAll}
									color="primary"
									onChange={(e) => handleSelectAll(e.target.checked)}
								/>
							</Tooltip>
						</ListItemIcon>
						<ListItemText>
							{creditors ? (
								<Button
									color="primary"
									onClick={handleMove}
									startIcon={<ArrowDownwardIcon />}
								>
									{t("move")}
								</Button>
							) : (
								<Button
									color="primary"
									onClick={handleMove}
									startIcon={<ArrowUpwardIcon />}
								>
									{t("move")}
								</Button>
							)}
							<Button
								className={classes.red}
								onClick={handleDelete}
								startIcon={<RemoveIcon />}
							>
								{t("remove")}
							</Button>
						</ListItemText>
					</ListItem>
				)}
			{data.users.map(
				(user, index) =>
					creditors === user.creditor && (
						<div key={user.id}>
							<ListItem
								className={classes.user}
								selected={bpxl && user.selected}
							>
								{bpxl && (
									<ListItemIcon>
										<Tooltip title="Select">
											<Checkbox
												checked={user.selected}
												color="primary"
												onChange={(e) => handleSelect(index, e.target.checked)}
											/>
										</Tooltip>
									</ListItemIcon>
								)}
								<ListItemAvatar>{<Avatar user={user} />}</ListItemAvatar>
								<ListItemText
									primary={user.username}
									primaryTypographyProps={{ noWrap: true }}
									secondary={
										<>
											{`${t(
												user.creditor ? "expenses:paid" : "expenses:to-pay"
											)}: `}
											<Currency
												amount={user.amount}
												code={data.expense.currency}
											/>
										</>
									}
									secondaryTypographyProps={{ noWrap: true }}
								></ListItemText>
								{bpxl ? (
									<>
										{method === "split-amount" ? (
											<TextField
												className={classes.textField}
												inputProps={{ min: 0, step: 0.01 }}
												onChange={(e) =>
													handleInputAmount(user.id, e.target.value)
												}
												placeholder={
													creditors ? t("expenses:paid") : t("expenses:to-pay")
												}
												required
												type="number"
												value={user.amount}
											/>
										) : method === "split-percentage" ? (
											<TextField
												className={classes.textField}
												inputProps={{ max: 100, min: 0 }}
												onChange={(e) =>
													handleInputPercentage(user.id, e.target.value)
												}
												required
												type="number"
												value={user.percentage}
											/>
										) : (
											<TextField
												className={classes.textField}
												inputProps={{
													min: 0,
													step: 1,
												}}
												onChange={(e) =>
													handleInputShare(user.id, e.target.value)
												}
												placeholder={
													creditors ? t("expenses:paid") : t("expenses:to-pay")
												}
												required
												type="number"
												value={user.share}
											/>
										)}
									</>
								) : (
									<Tooltip title={t("edit")}>
										<IconButton
											onClick={(e) => handleSelect(index, !user.selected)}
										>
											<ExpandMoreIcon
												className={`${classes.expand} ${
													user.selected && classes.expanded
												}`}
											/>
										</IconButton>
									</Tooltip>
								)}
							</ListItem>
							{!bpxl && (
								<Collapse in={user.selected} unmountOnExit>
									<ListItem>
										<ListItemIcon>
											<Tooltip title={t("move")}>
												<IconButton
													color="primary"
													onClick={() => handleMoveIndex(index)}
												>
													{creditors ? (
														<ArrowDownwardIcon />
													) : (
														<ArrowUpwardIcon />
													)}
												</IconButton>
											</Tooltip>
										</ListItemIcon>
										<ListItemIcon>
											<Tooltip title={t("remove")}>
												<IconButton
													className={classes.red}
													onClick={() => handleDeleteIndex(index)}
												>
													<RemoveIcon />
												</IconButton>
											</Tooltip>
										</ListItemIcon>
										<div style={{ marginLeft: "auto" }}>
											{method === "split-amount" ? (
												<TextField
													className={classes.textField}
													inputProps={{ min: 0, step: 0.01 }}
													onChange={(e) =>
														handleInputAmount(user.id, e.target.value)
													}
													placeholder={
														creditors
															? t("expenses:paid")
															: t("expenses:to-pay")
													}
													required
													type="number"
													value={user.amount}
												/>
											) : method === "split-percentage" ? (
												<TextField
													className={classes.textField}
													inputProps={{ max: 100, min: 0 }}
													onChange={(e) =>
														handleInputPercentage(user.id, e.target.value)
													}
													required
													type="number"
													value={user.percentage}
												/>
											) : (
												<TextField
													className={classes.textField}
													inputProps={{
														min: 0,
														step: 1,
													}}
													onChange={(e) =>
														handleInputShare(user.id, e.target.value)
													}
													placeholder={
														creditors
															? t("expenses:paid")
															: t("expenses:to-pay")
													}
													required
													type="number"
													value={user.share}
												/>
											)}
										</div>
									</ListItem>
								</Collapse>
							)}
						</div>
					)
			)}
			<ListItem
				button
				onClick={onUserAdd}
				style={{ paddingBottom: "1rem", paddingTop: "1rem" }}
			>
				<ListItemAvatar style={{ marginLeft: bpxl ? "3.5rem" : "0" }}>
					<MuiAvatar>
						<AddIcon />
					</MuiAvatar>
				</ListItemAvatar>
				<ListItemText>{t("add")}</ListItemText>
			</ListItem>
			{data.users.filter((user) => creditors === user.creditor).length > 0 && (
				<>
					<Divider />
					<ListItem>
						<ListItemText>
							<Typography variant="h6">{t("total")}</Typography>
						</ListItemText>
						<ListItemText
							primary={
								<Typography
									className={
										differenceAmount() === 0 ? classes.primary : classes.red
									}
								>
									<Currency
										amount={totalAmount()}
										code={data.expense.currency}
									/>
								</Typography>
							}
							secondary={
								<>
									{`${t("remains")}: `}
									<Currency
										amount={differenceAmount()}
										code={data.expense.currency}
									/>
								</>
							}
							style={{ textAlign: "right" }}
						></ListItemText>
					</ListItem>
				</>
			)}
		</List>
	);
}

export default ExpenseSplitList;
