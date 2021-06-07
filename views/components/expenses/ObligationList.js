// React & Next
import { useTranslation } from "next-i18next";
import {
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from "@material-ui/core";
import Avatar from "../Avatar";
import { useContext } from "react";
import { UserContext } from "../auth/User";
import Currency from "./Currency";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	amount: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		marginLeft: "auto",
	},
}));

function ObligationList({ obligations }) {
	const { t } = useTranslation(["common", "expenses"]);
	const { user } = useContext(UserContext);
	const classes = useStyles();
	return (
		<List>
			{obligations.map((obligation, index) => {
				return (
					<ListItem key={index}>
						<ListItemAvatar>
							{obligation.debtor.id === user.id ? (
								<Avatar user={obligation.creditor} />
							) : (
								<Avatar user={obligation.debtor} />
							)}
						</ListItemAvatar>
						<ListItemText
							primary={
								obligation.debtor.id === user.id
									? obligation.creditor.username
									: obligation.debtor.username
							}
							secondary={obligation.title}
						/>
						<div className={classes.amount}>
							<Typography align="right" color="textSecondary" variant="body2">
								{t("expenses:to-pay")}
							</Typography>
							<Typography
								align="right"
								color={obligation.debtor.id === user.id ? "error" : "primary"}
							>
								<Currency
									amount={obligation.amount / 100}
									code={obligation.expense.currency}
								/>
							</Typography>
						</div>
					</ListItem>
				);
			})}
		</List>
	);
}

export default ObligationList;
