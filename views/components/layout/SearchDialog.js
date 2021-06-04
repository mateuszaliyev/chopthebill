// React & Next
import { useContext, useEffect, useState } from "react";
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
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";

// Components
import Avatar from "../Avatar";
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

function SearchDialog({ onClose, open, placeholder, redirect, title }) {
	const { t } = useTranslation("common");

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
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				query: input,
			}),
		});
		if (res.ok) {
			const data = await res.json();
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
				<Tooltip title={t("close")}>
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
				{results && results.users && results.users.length > 0 ? (
					<List>
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
									<ListItem
										button
										className={user.email ? "" : classes.padding}
									>
										<ListItemAvatar>
											<Avatar user={user} />
										</ListItemAvatar>
										<ListItemText
											primary={user.username}
											secondary={user.email}
										/>
									</ListItem>
								</Link>
							) : (
								<ListItem
									button
									className={user.email ? "" : classes.padding}
									key={user.id}
									onClick={() => handleClose(user)}
								>
									<ListItemAvatar>
										<Avatar user={user} />
									</ListItemAvatar>
									<ListItemText
										primary={user.username}
										secondary={user.email}
									/>
								</ListItem>
							)
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
