// React & Next
import { useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { Badge, IconButton, Tooltip } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";

// Components
import NotificationDialog from "./NotificationDialog";

function NotificationButton({ amount, color }) {
	const { t } = useTranslation("common");
	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Tooltip title={t("notifications")}>
				<IconButton color="inherit" onClick={handleClick}>
					<Badge badgeContent={amount} color={color} overlap="circle">
						<NotificationsIcon />
					</Badge>
				</IconButton>
			</Tooltip>
			<NotificationDialog
				onClose={handleClose}
				open={open}
				title={t("notifications")}
			/>
		</>
	);
}

export default NotificationButton;
