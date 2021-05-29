// React & Next
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Badge,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Collapse,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Tooltip,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// Components
import Avatar from "../Avatar";
import Currency from "./Currency";

// Hooks
import useWindowSize from "../hooks/useWindowSize";
import Link from "../Link";

// Styles
const useStyles = makeStyles((theme) => ({
	amount: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		marginLeft: "auto",
	},
	expand: {
		marginLeft: "auto",
		transform: "rotate(0deg)",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expanded: {
		transform: "rotate(180deg)",
	},
	root: {
		maxWidth: "24rem",
		minWidth: ({ width }) => (width >= 416 ? "24rem" : "100%"),
	},
	smallAvatar: {
		border: `2px solid ${theme.palette.background.paper}`,
		fontSize: "0.75rem",
		height: "1.5rem",
		width: "1.5rem",
	},
}));

function Expense({ className, data }) {
	const { t } = useTranslation("common");

	const [expanded, setExpanded] = useState(false);

	const router = useRouter();

	const { width } = useWindowSize();
	const classes = useStyles({ width });

	return (
		<Card className={`${className} ${classes.root}`}>
			<CardHeader
				avatar={<Avatar user={data.expense.user} />}
				subheader={`${data.expense.date.toLocaleDateString(
					router.locale
				)} ${data.expense.date.toLocaleTimeString(router.locale, {
					hour: "2-digit",
					minute: "2-digit",
				})}`}
				title={data.expense.user.username}
			/>
			<Divider variant="middle" />
			<CardContent>
				<Typography gutterBottom variant="h5">
					{data.expense.title || t("new-expense")}
				</Typography>
				<Typography color="textSecondary">
					{data.expense.description
						? data.expense.description.split("\n").map((line) => (
								<span key={line}>
									{line}
									<br />
								</span>
						  ))
						: t("description")}
				</Typography>
			</CardContent>
			{/* <CardMedia
				image="https://madameedith.com/wp-content/uploads/2020/07/20200705_143623-1.jpg"
				style={{ height: "13.5rem" }}
			/> */}
			<CardContent>
				<Typography align="right" variant="h4">
					<Currency amount={data.expense.amount} code={data.expense.currency} />
				</Typography>
			</CardContent>
			<CardActions>
				<Tooltip title={t("obligations")}>
					<IconButton
						className={`${classes.expand} ${expanded && classes.expanded}`}
						onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
					>
						<ExpandMoreIcon />
					</IconButton>
				</Tooltip>
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<List>
					{data.obligations.map((obligation, index) => (
						<ListItem key={index}>
							<ListItemAvatar>
								<Badge
									anchorOrigin={{
										vertical: "bottom",
										horizontal: "right",
									}}
									badgeContent={
										<Link href={`/user/${obligation.creditor.id}`}>
											<Avatar
												className={classes.smallAvatar}
												user={obligation.creditor}
											/>
										</Link>
									}
									overlap="circle"
								>
									<Link href={`/user/${obligation.debtor.id}`}>
										<Avatar user={obligation.debtor} />
									</Link>
								</Badge>
							</ListItemAvatar>
							<ListItemText
								primary={obligation.debtor.username}
								secondary={`${obligation.creditor.username}`}
							/>
							<div className={classes.amount}>
								<Typography align="right" color="textSecondary" variant="body2">
									{t("expenses:to-pay")}
								</Typography>
								<Typography align="right">
									<Currency
										amount={obligation.amount}
										code={data.expense.currency}
									/>
								</Typography>
							</div>
						</ListItem>
					))}
				</List>
			</Collapse>
		</Card>
	);
}

export default Expense;
