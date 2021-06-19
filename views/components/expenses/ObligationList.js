// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	ListSubheader,
	makeStyles,
	Snackbar,
	Tooltip,
	Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import DoneIcon from "@material-ui/icons/Done";
import UndoIcon from "@material-ui/icons/Undo";

// Components
import Avatar from "../Avatar";
import Currency from "./Currency";
import Link from "../Link";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../auth/User";

// Styles
const useStyles = makeStyles((theme) => ({
	amount: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		marginLeft: "auto",
		marginRight: "1rem",
	},
}));

function ObligationListItem({ obligation, onClick = null, settled = false }) {
	const { t } = useTranslation();

	const { user } = useContext(UserContext);

	const classes = useStyles();

	const creditor = obligation.creditor.id === user.id;

	return (
		<ListItem disabled={settled}>
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
				secondary={obligation.expense.title}
			/>
			<div className={classes.amount}>
				<Typography align="right" color="textSecondary" variant="body2">
					{settled
						? creditor
							? t("expenses:received")
							: t("expenses:paid")
						: creditor
						? t("expenses:to-receive")
						: t("expenses:to-pay")}
				</Typography>
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
			<ListItemSecondaryAction>
				{creditor && onClick && (
					<Tooltip
						title={settled ? t("expenses:revoke") : t("expenses:settle")}
					>
						<IconButton
							edge="end"
							onClick={onClick ? () => onClick(obligation.id) : null}
						>
							{settled ? <UndoIcon /> : <DoneIcon />}
						</IconButton>
					</Tooltip>
				)}
			</ListItemSecondaryAction>
		</ListItem>
	);
}
function ObligationList({ obligations, setObligations }) {
	const { t } = useTranslation();

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

	const handleClick = async (id) => {
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
					onClick={handleClick}
				/>
			))}
			{settled.length > 0 && (
				<ListSubheader>{t("expenses:settled")}</ListSubheader>
			)}
			{settled.map((obligation, index) => (
				<ObligationListItem
					key={index}
					obligation={obligation}
					onClick={handleClick}
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
					severity="error"
					variant="filled"
				>
					{snackbarText}
				</Alert>
			</Snackbar>
		</List>
	);
}

export default ObligationList;
