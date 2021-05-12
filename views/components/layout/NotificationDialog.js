// Material UI
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

// Styles
const useStyles = makeStyles((theme) => ({
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
	},
}));

function NotificationDialog({ onClose, open, title }) {
	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
			<DialogContent dividers>TODO: {title}</DialogContent>
		</Dialog>
	);
}

export default NotificationDialog;
