import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	InputBase,
	Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
	input: {
		marginLeft: "1rem",
	},
}));

function SearchDialog({ onClose, open, title }) {
	const classes = useStyles();

	return (
		<Dialog onClose={onClose} open={open}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>
				<Paper component="form">
					<InputBase className={classes.input} placeholder={`TODO: ${title}`} />
					<IconButton>
						<SearchIcon />
					</IconButton>
				</Paper>
			</DialogContent>
		</Dialog>
	);
}

export default SearchDialog;
