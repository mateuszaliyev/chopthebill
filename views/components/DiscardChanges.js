// React & Next
import { useTranslation } from "next-i18next";

// Material UI
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Styles
const useStyles = makeStyles((theme) => ({
	red: {
		color: theme.palette.error.main,
		"&:hover": {
			backgroundColor: `${theme.palette.error.main}0a`,
		},
	},
}));

function DiscardChanges({ onClose, open }) {
	const { t } = useTranslation("common");

	const classes = useStyles();

	const handleClose = (discarded) => {
		onClose(discarded);
	};

	return (
		<Dialog open={open}>
			<DialogTitle>{t("discard-changes")}</DialogTitle>
			<DialogContent>
				<DialogContentText>{t("discard-changes-details")}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button color="primary" onClick={() => handleClose(false)}>
					{t("cancel")}
				</Button>
				<Button
					autoFocus
					className={classes.red}
					onClick={() => handleClose(true)}
				>
					{t("discard")}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default DiscardChanges;
