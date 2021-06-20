// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListSubheader,
	makeStyles,
	Menu,
	MenuItem,
	Snackbar,
	Tooltip,
	Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import DoneIcon from "@material-ui/icons/Done";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import UndoIcon from "@material-ui/icons/Undo";

// Components
import Avatar from "../Avatar";
import Currency, { getCurrencyString } from "./Currency";
import Link from "../Link";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../auth/User";

// Hooks
import useWindowSize from "../hooks/useWindowSize";

// Styles
const useStyles = makeStyles((theme) => ({
	action: {
		color: theme.palette.error.main,
		display: "flex",
		flexWrap: "nowrap",
		justifyContent: "flex-end",
		minWidth: "5.25rem",
	},
	amount: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		marginLeft: "auto",
		marginRight: "1rem",
	},
	disabled: {
		opacity: "0.5",
	},
	notification: {
		color: theme.palette.text.secondary,
	},
}));

function ObligationListItem({
	obligation,
	onNotify = null,
	onSettle = null,
	settled = false,
}) {
	const { t } = useTranslation();

	const [menuAnchor, setMenuAnchor] = useState(null);

	const { user } = useContext(UserContext);

	const classes = useStyles();
	const { width } = useWindowSize();

	const creditor = obligation.creditor.id === user.id;

	const handleClick = (e) => {
		setMenuAnchor(e.currentTarget);
	};

	const handleClose = () => {
		setMenuAnchor(null);
	};

	const handleNotify = () => {
		onNotify(obligation.id);
		setMenuAnchor(null);
	};

	const handleSettle = () => {
		onSettle(obligation.id);
		setMenuAnchor(null);
	};

	return (
		<>
			<ListItem
				button={
					width < 600 && creditor && Boolean(onNotify) && Boolean(onSettle)
				}
				className={settled ? classes.disabled : ""}
				onClick={width < 600 && creditor ? handleClick : null}
			>
				<ListItemAvatar>
					<Link
						color="inherit"
						href={`/user/${
							creditor ? obligation.debtor.id : obligation.creditor.id
						}`}
						underline="none"
					>
						{obligation.debtor.id === user.id ? (
							<Avatar user={obligation.creditor} />
						) : (
							<Avatar user={obligation.debtor} />
						)}
					</Link>
				</ListItemAvatar>
				<ListItemText
					primary={
						creditor ? (
							obligation.debtor ? (
								<Link
									color="inherit"
									href={`/user/${obligation.debtor.id}`}
									underline="none"
								>
									{obligation.debtor.username}
								</Link>
							) : (
								t("deleted-user")
							)
						) : obligation.creditor ? (
							<Link
								color="inherit"
								href={`/user/${obligation.creditor.id}`}
								underline="none"
							>
								{obligation.creditor.username}
							</Link>
						) : (
							t("deleted-user")
						)
					}
					primaryTypographyProps={{ noWrap: true }}
					secondary={obligation.expense.title}
					secondaryTypographyProps={{ noWrap: true }}
				/>
				<div className={classes.amount}>
					{width >= 360 && (
						<Typography align="right" color="textSecondary" variant="body2">
							{settled
								? creditor
									? t("expenses:received")
									: t("expenses:paid")
								: creditor
								? t("expenses:to-receive")
								: t("expenses:to-pay")}
						</Typography>
					)}
					<Typography
						align="right"
						color={settled ? "textSecondary" : creditor ? "primary" : "error"}
					>
						<Currency
							amount={obligation.amount / 100}
							code={obligation.expense.currency}
						/>
					</Typography>
				</div>
				{width >= 600 && (
					<div className={classes.action}>
						<Tooltip title={t("expenses:notify")}>
							<span>
								<IconButton
									className={classes.notification}
									disabled={
										!creditor ||
										!Boolean(onNotify) ||
										!Boolean(onSettle) ||
										settled
									}
									onClick={() => onNotify(obligation.id)}
								>
									<NotificationsActiveIcon />
								</IconButton>
							</span>
						</Tooltip>
						<Tooltip
							title={settled ? t("expenses:revoke") : t("expenses:settle")}
						>
							<span>
								<IconButton
									color={settled ? "inherit" : "primary"}
									disabled={
										!creditor || !Boolean(onNotify) || !Boolean(onSettle)
									}
									edge="end"
									onClick={() => onSettle(obligation.id)}
								>
									{settled ? <UndoIcon /> : <DoneIcon />}
								</IconButton>
							</span>
						</Tooltip>
					</div>
				)}
			</ListItem>
			{Boolean(onNotify) && Boolean(onSettle) && (
				<Menu
					anchorEl={menuAnchor}
					keepMounted
					onClose={handleClose}
					open={Boolean(menuAnchor)}
				>
					<MenuItem onClick={handleNotify}>{t("expenses:notify")}</MenuItem>
					<MenuItem onClick={handleSettle}>
						{t(settled ? "expenses:revoke" : "expenses:settle")}
					</MenuItem>
				</Menu>
			)}
		</>
	);
}

function ObligationList({ obligations, setObligations }) {
	const { t } = useTranslation();

	const [snackbarSeverity, setSnackbarSeverity] = useState("info");
	const [snackbarText, setSnackbarText] = useState(null);

	const { accessToken } = useContext(UserContext);

	const pending = obligations.filter(
		(obligation) => !obligation.expense.settled && !obligation.settled
	);

	const settled = obligations.filter(
		(obligation) => !obligation.expense.settled && obligation.settled
	);

	const completed = obligations.filter(
		(obligation) => obligation.expense.settled
	);

	const handleNotify = async (id) => {
		const obligation = obligations.find((obligation) => id === obligation.id);

		const res = await fetch(`${host}/notifications/obligation/${id}`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				creditor: obligation.creditor.id,
				debtor: obligation.debtor.id,
				description: t("expenses:obligation-notification-description", {
					amount: getCurrencyString(
						obligation.amount / 100,
						obligation.expense.currency
					),
					expense: obligation.expense.title,
					lng: obligation.debtor.language,
					user: obligation.creditor.username,
				}),
				obligation: obligation.id,
				redirect: "/obligations",
				title: t("expenses:obligation-notification-title", {
					lng: obligation.debtor.language,
				}),
			}),
		});

		if (res.ok) {
			setSnackbarSeverity("success");
			setSnackbarText(t("expenses:user-notified-successfully"));
		} else {
			setSnackbarSeverity("error");
			setSnackbarText(`${t("something-went-wrong")}. ${t("try-again")}.`);
		}
	};

	const handleSettle = async (id) => {
		const index = obligations.findIndex((obligation) => id === obligation.id);
		const settled = obligations[index].settled;

		const res = await fetch(
			`${host}/obligations/${settled ? "revoke" : "settle"}/${id}`,
			{
				method: "PUT",
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (res.ok) {
			setObligations((prevObligations) => {
				const newObligations = [...prevObligations];
				newObligations[index].settled = !newObligations[index].settled;
				return newObligations;
			});
		} else {
			setSnackbarSeverity("error");
			setSnackbarText(`${t("something-went-wrong")}. ${t("try-again")}.`);
		}
	};

	return (
		<List>
			{pending.length > 0 && (
				<ListSubheader>{t("expenses:pending")}</ListSubheader>
			)}
			{pending.map((obligation, index) => (
				<ObligationListItem
					key={index}
					obligation={obligation}
					onNotify={handleNotify}
					onSettle={handleSettle}
				/>
			))}
			{settled.length > 0 && (
				<ListSubheader>{t("expenses:settled")}</ListSubheader>
			)}
			{settled.map((obligation, index) => (
				<ObligationListItem
					key={index}
					obligation={obligation}
					onNotify={handleNotify}
					onSettle={handleSettle}
					settled
				/>
			))}
			{completed.length > 0 && (
				<ListSubheader>{t("expenses:completed")}</ListSubheader>
			)}
			{completed.map((obligation, index) => (
				<ObligationListItem key={index} obligation={obligation} settled />
			))}
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
		</List>
	);
}

export default ObligationList;
