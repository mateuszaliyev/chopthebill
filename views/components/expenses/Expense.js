// React & Next
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Badge,
	Card,
	CardContent,
	CardHeader,
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
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// Components
import Avatar from "../Avatar";
import Currency from "./Currency";
import Link from "../Link";

// Contexts
import { UserContext } from "../auth/User";

// Hooks
import useWindowSize from "../hooks/useWindowSize";

// Styles
const useStyles = makeStyles((theme) => ({
	amount: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		marginLeft: "auto",
	},
	expand: {
		transform: "rotate(0deg)",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expanded: {
		transform: "rotate(180deg)",
	},
	root: {
		display: "flex",
		flexDirection: "column",
		maxWidth: "24rem",
		minWidth: ({ width }) => (width >= 416 ? "24rem" : "100%"),
	},
	smallAvatar: {
		border: `2px solid ${theme.palette.background.paper}`,
		fontSize: "0.75rem",
		height: "1.5rem",
		width: "1.5rem",
	},
	total: {
		display: "flex",
		justifyContent: "space-between",
		width: "100%",
	},
}));

function Expense({ className, data, onEdit = null }) {
	const { t } = useTranslation();

	const [expanded, setExpanded] = useState(false);

	const { user } = useContext(UserContext);

	const router = useRouter();

	const { width } = useWindowSize();
	const classes = useStyles({ width });

	return (
		<Card className={`${className} ${classes.root}`}>
			<CardHeader
				action={
					onEdit && (
						<Tooltip title={t("edit")}>
							<IconButton onClick={onEdit}>
								<EditIcon />
							</IconButton>
						</Tooltip>
					)
				}
				avatar={
					data.expense.user ? (
						<Link
							color="inherit"
							href={`/user/${data.expense.user.id}`}
							underline="none"
						>
							<Avatar user={data.expense.user} />
						</Link>
					) : (
						<Avatar />
					)
				}
				subheader={`${data.expense.date.toLocaleDateString(
					router.locale
				)} ${data.expense.date.toLocaleTimeString(router.locale, {
					hour: "2-digit",
					minute: "2-digit",
				})}`}
				title={
					<>
						{data.expense.group.id !== null && (
							<>
								<Link color="inherit" href={`/group/${data.expense.group.id}`}>
									{data.expense.group.name}
								</Link>
								{" / "}
							</>
						)}
						{data.expense.user ? (
							<Link color="inherit" href={`/user/${data.expense.user.id}`}>
								{data.expense.user.username}
							</Link>
						) : (
							t("deleted-user")
						)}
					</>
				}
			/>
			<Divider variant="middle" />
			<CardContent>
				<Typography gutterBottom variant="h5">
					{data.expense.title || t("expenses:new-expense")}
				</Typography>
				<Typography color="textSecondary">
					{data.expense.description
						? data.expense.description.split("\n").map((line, index) => (
								<span key={index}>
									{line}
									<br />
								</span>
						  ))
						: t("description")}
				</Typography>
			</CardContent>
			<CardContent className={classes.total}>
				<Tooltip title={t("obligations")}>
					<IconButton
						className={`${classes.expand} ${expanded && classes.expanded}`}
						edge="start"
						onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
					>
						<ExpandMoreIcon />
					</IconButton>
				</Tooltip>
				<Typography align="right" variant="h4">
					<Currency
						amount={data.expense.amount / 100}
						code={data.expense.currency}
					/>
				</Typography>
			</CardContent>
			<Collapse in={expanded} timeout="auto">
				<List>
					{data.obligations.map((obligation, index) => (
						<ListItem button={obligation.creditor?.id === user.id} key={index}>
							<ListItemAvatar>
								<Badge
									anchorOrigin={{
										vertical: "bottom",
										horizontal: "right",
									}}
									badgeContent={
										obligation.creditor ? (
											<Link
												color="inherit"
												href={`/user/${obligation.creditor.id}`}
												underline="none"
											>
												<Avatar
													className={classes.smallAvatar}
													user={obligation.creditor}
												/>
											</Link>
										) : (
											<Avatar className={classes.smallAvatar} />
										)
									}
									overlap="circle"
								>
									{obligation.debtor ? (
										<Link
											color="inherit"
											href={`/user/${obligation.debtor.id}`}
											underline="none"
										>
											<Avatar user={obligation.debtor} />
										</Link>
									) : (
										<Avatar />
									)}
								</Badge>
							</ListItemAvatar>
							<ListItemText
								primary={
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
								}
								secondary={
									obligation.creditor ? (
										<Link
											color="inherit"
											href={`/user/${obligation.creditor?.id}`}
											underline="none"
										>
											{obligation.creditor?.username}
										</Link>
									) : (
										t("deleted-user")
									)
								}
							/>
							<div className={classes.amount}>
								<Typography align="right" color="textSecondary" variant="body2">
									{t("expenses:to-pay")}
								</Typography>
								<Typography align="right">
									<Currency
										amount={obligation.amount / 100}
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
