// React & Next
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
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
	useMediaQuery,
	Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";

// Components
import Avatar from "../Avatar";
import Link from "../Link";

// Config
import { host } from "../../config";

// Context
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

function SearchDialog({ onClose, open, title }) {
	const { t } = useTranslation("common");

	const { accessToken } = useContext(UserContext);

	const [input, setInput] = useState("");
	const [results, setResults] = useState([]);
	const [submitted, setSubmitted] = useState(false);

	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const handleChange = (e) => {
		setInput(e.target.value);
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
		const data = await res.json();
		setResults(data.results);
		setSubmitted(true);
	};

	useEffect(() => {
		if (open) {
			setResults([]);
			setSubmitted(false);
		}
	}, [open]);

	return (
		<Dialog
			fullScreen={fullScreen}
			fullWidth={true}
			onClose={onClose}
			open={open}
		>
			<DialogTitle>
				{title}
				<IconButton
					aria-label="close"
					className={classes.closeButton}
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent dividers>
				<Paper
					className={classes.paper}
					component="form"
					onSubmit={handleSubmit}
				>
					<InputBase
						className={classes.input}
						placeholder={t("search-users")}
						onChange={handleChange}
					/>
					<Tooltip title={t("search")}>
						<IconButton type="submit">
							<SearchIcon />
						</IconButton>
					</Tooltip>
				</Paper>
				{results && results.length > 0 ? (
					<List>
						<ListSubheader>{t("users")}</ListSubheader>
						{results.map((user) => (
							<Link
								color="inherit"
								href={`/user/${user.id}`}
								key={user.id}
								onClick={onClose}
								underline="none"
							>
								<ListItem button className={user.email ? "" : classes.padding}>
									<ListItemAvatar>
										<Avatar
											alt={user.username}
											// src={`${host}/avatars/${user.id_user}.png`}
										/>
									</ListItemAvatar>
									<ListItemText
										primary={user.username}
										secondary={user.email}
									/>
								</ListItem>
							</Link>
						))}
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
