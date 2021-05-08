import { useState, useContext, useEffect } from "react";
import { UserContext } from "../auth/User";
import { useTranslation } from "next-i18next";
import Link from "../Link";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	InputBase,
	List,
	ListItem,
	ListItemText,
	Paper,
	Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { host } from "../../config";

const useStyles = makeStyles((theme) => ({
	input: {
		marginLeft: "1rem",
	},
}));

function SearchDialog({ onClose, open, title }) {
	const { t } = useTranslation("common");
	const classes = useStyles();
	const [input, setInput] = useState("");
	const [results, setResults] = useState([]);
	const [list, setList] = useState();
	const { accessToken } = useContext(UserContext);

	const handleClick = async () => {
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
		setResults(data.result);
	};

	const handleChange = (e) => {
		setInput(e.target.value);
	};

	useEffect(() => {
		const newList = results.map((user) => {
			console.log(user.username);
			<Link
				color="inherit"
				href={`users/${user.id_user}`}
				key={user.id_user}
				underline="none"
			>
				<ListItem>
					<ListItemText primary={user.username} />
				</ListItem>
			</Link>;
		});
		setList(newList);
	}, [results]);

	return (
		<Dialog onClose={onClose} open={open}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>
				<Paper>
					<InputBase
						className={classes.input}
						placeholder={t("search-users")}
						onChange={handleChange}
					/>
					<Tooltip title={t("search")}>
						<IconButton onClick={handleClick}>
							<SearchIcon />
						</IconButton>
					</Tooltip>
				</Paper>
			</DialogContent>
			<DialogContent>
				<Paper>
					<List>{list}</List>
				</Paper>
			</DialogContent>
		</Dialog>
	);
}

export default SearchDialog;
