// React & Next
import { useTranslation } from "next-i18next";

// Material UI
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Tooltip,
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
	const { t } = useTranslation("common");

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
				<Tooltip title={t("close")}>
					<IconButton className={classes.closeButton} onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			</DialogTitle>
			<DialogContent>TODO: {title}</DialogContent>
		</Dialog>
	);
}

export default NotificationDialog;
