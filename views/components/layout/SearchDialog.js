// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	InputBase,
	List,
	ListSubheader,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Paper,
	Tooltip,
	Typography,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import SearchIcon from "@material-ui/icons/Search";

// Components
import Avatar from "../Avatar";
import Currency from "../expenses/Currency";
import Link from "../Link";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../auth/User";

// Styles
const useStyles = makeStyles((theme) => ({
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
	},
	input: {
		flex: 1,
		marginLeft: "1rem",
	},
	padding: {
		paddingBottom: "1rem",
		paddingTop: "1rem",
	},
	paper: {
		display: "flex",
	},
}));

function ListItemExpense({ expense, onClose }) {
	const classes = useStyles();
	const router = useRouter();

	return (
		<ListItem
			button
			className={expense.description ? classes.padding : ""}
			onClick={onClose}
		>
			<ListItemAvatar>
				<Avatar alt={expense.title}>
					{expense.settled ? <DoneIcon /> : <AttachMoneyIcon />}
				</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={expense.title}
				primaryTypographyProps={{ noWrap: true }}
				secondary={
					<span>
						{new Date(expense.date).toLocaleDateString(router.locale)} -{" "}
						<Currency amount={expense.amount / 100} code={expense.currency} />
					</span>
				}
				secondaryTypographyProps={{ noWrap: true }}
			/>
		</ListItem>
	);
}

function ListItemGroup({ group, onClose }) {
	const classes = useStyles();

	return (
		<ListItem
			button
			className={group.description ? "" : classes.padding}
			onClick={onClose}
		>
			<ListItemAvatar>
				<Avatar alt={group.name} />
			</ListItemAvatar>
			<ListItemText
				primary={group.name}
				primaryTypographyProps={{ noWrap: true }}
				secondary={group.description}
				secondaryTypographyProps={{ noWrap: true }}
			/>
		</ListItem>
	);
}

function ListItemUser({ onClose, user }) {
	const classes = useStyles();

	return (
		<ListItem
			button
			className={user.email ? "" : classes.padding}
			onClick={onClose}
		>
			<ListItemAvatar>
				<Avatar user={user} />
			</ListItemAvatar>
			<ListItemText
				primary={user.username}
				primaryTypographyProps={{ noWrap: true }}
				secondary={user.email}
				secondaryTypographyProps={{ noWrap: true }}
			/>
		</ListItem>
	);
}

function SearchDialog({
	closeButtonTooltip = null,
	expenses = false,
	groups = false,
	onClose,
	open,
	placeholder,
	redirect,
	title,
	users = false,
}) {
	const { t } = useTranslation();

	const { accessToken } = useContext(UserContext);

	const [input, setInput] = useState("");
	const [results, setResults] = useState({});
	const [submitted, setSubmitted] = useState(false);

	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const handleChange = (e) => {
		setInput(e.target.value);
	};

	const handleClose = (returnValue) => {
		if (returnValue && returnValue !== {}) {
			onClose(returnValue);
		} else {
			onClose(null);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (input.length < 3) {
			return;
		}
		const res = await fetch(`${host}/search`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: input,
			}),
		});
		if (res.ok) {
			const data = await res.json();

			if (!expenses) {
				delete data.expenses;
			}

			if (!groups) {
				delete data.groups;
			}

			if (!users) {
				delete data.users;
			}

			setResults(data);
			setSubmitted(true);
		}
	};

	useEffect(() => {
		if (open) {
			setResults({});
			setSubmitted(false);
		}
	}, [open]);

	return (
		<Dialog
			fullScreen={fullScreen}
			fullWidth={true}
			onClose={() => handleClose(null)}
			open={open}
		>
			<DialogTitle>
				{title}
				<Tooltip title={closeButtonTooltip || t("close")}>
					<IconButton
						className={classes.closeButton}
						onClick={() => handleClose(null)}
					>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			</DialogTitle>
			<DialogContent>
				<Paper
					className={classes.paper}
					component="form"
					onSubmit={handleSubmit}
				>
					<InputBase
						autoFocus
						className={classes.input}
						placeholder={placeholder}
						onChange={handleChange}
					/>
					<Tooltip title={t("search")}>
						<IconButton type="submit">
							<SearchIcon />
						</IconButton>
					</Tooltip>
				</Paper>
				{!submitted && (
					<Box m={1}>
						<Typography variant="caption">
							{t("characters-required")}
						</Typography>
					</Box>
				)}
				{results?.expenses?.length > 0 ||
				results?.groups?.length > 0 ||
				results?.users?.length > 0 ? (
					<List>
						{users && results?.users?.length > 0 && (
							<>
								<ListSubheader>{t("users")}</ListSubheader>
								{results.users.map((user) =>
									redirect ? (
										<Link
											color="inherit"
											href={`/user/${user.id}`}
											key={user.id}
											onClick={() => handleClose(null)}
											underline="none"
										>
											<ListItemUser
												onClose={() => handleClose(null)}
												user={user}
											/>
										</Link>
									) : (
										<ListItemUser
											key={user.id}
											onClose={() => handleClose(user)}
											user={user}
										/>
									)
								)}
							</>
						)}
						{groups && results?.groups?.length > 0 && (
							<>
								<ListSubheader>{t("groups")}</ListSubheader>
								{results.groups.map((group) =>
									redirect ? (
										<Link
											color="inherit"
											href={`/group/${group.id}`}
											key={group.id}
											onClick={() => handleClose(null)}
											underline="none"
										>
											<ListItemGroup
												group={group}
												onClose={() => handleClose(null)}
											/>
										</Link>
									) : (
										<ListItemGroup
											group={group}
											key={group.id}
											onClose={() => handleClose(group)}
										/>
									)
								)}
							</>
						)}
						{expenses && results?.expenses?.length > 0 && (
							<>
								<ListSubheader>{t("expenses")}</ListSubheader>
								{results.expenses.map((expense) =>
									redirect ? (
										<Link
											color="inherit"
											href={`/expense/${expense.id}`}
											key={expense.id}
											onClick={() => handleClose(null)}
											underline="none"
										>
											<ListItemExpense
												expense={expense}
												onClose={() => handleClose(null)}
											/>
										</Link>
									) : (
										<ListItemExpense
											expense={expense}
											key={expense.id}
											onClose={() => handleClose(expense)}
										/>
									)
								)}
							</>
						)}
					</List>
				) : (
					submitted && (
						<List>
							<ListItem>
								<ListItemText>
									<Typography color="error">{t("no-results")}</Typography>
								</ListItemText>
							</ListItem>
						</List>
					)
				)}
			</DialogContent>
		</Dialog>
	);
}

export default SearchDialog;
