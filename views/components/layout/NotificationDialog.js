import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";

function NotificationDialog({ onClose, open, title }) {
	return (
		<Dialog onClose={onClose} open={open}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>TODO: {title}</DialogContent>
		</Dialog>
	);
}

export default NotificationDialog;
