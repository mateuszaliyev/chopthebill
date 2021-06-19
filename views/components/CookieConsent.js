// React & Next
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { Button, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

function CookieConsent({ vertical = "bottom", horizontal = "center" }) {
	const { t } = useTranslation();

	const [open, setOpen] = useState(false);

	const handleClose = () => {
		localStorage.setItem("consent", "true");
		setOpen(false);
	};

	useEffect(() => {
		const consent = localStorage.getItem("consent");
		if (consent !== "true") {
			setOpen(true);
		}
	}, []);

	return (
		<Snackbar anchorOrigin={{ vertical, horizontal }} open={open}>
			<Alert
				action={
					<Button color="inherit" onClick={handleClose} size="small">
						{t("understand")}
					</Button>
				}
				elevation={6}
				severity="info"
			>
				{t("consent")}
			</Alert>
		</Snackbar>
	);
}

export default CookieConsent;
