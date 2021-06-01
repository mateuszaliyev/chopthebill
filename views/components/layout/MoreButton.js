// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

// Components
import Link from "../Link";
import NotificationDialog from "./NotificationDialog";
import SearchDialog from "./SearchDialog";

// Context
import { UserContext } from "../auth/User";

function MoreButton({ ...props }) {
	const { t } = useTranslation("common");

	const [avatarAnchor, setAvatarAnchor] = useState(null);
	const [openDialog, setOpenDialog] = useState({
		notification: false,
		search: false,
	});

	const { user } = useContext(UserContext);

	const handleClick = (e) => {
		setAvatarAnchor(e.currentTarget);
	};

	const handleClose = () => {
		setAvatarAnchor(null);
	};

	const handleNotificationDialog = () => {
		handleClose();
		setOpenDialog((prevOpenDialog) => ({
			...prevOpenDialog,
			notification: !prevOpenDialog.notification,
		}));
	};

	const handleSearchDialog = () => {
		handleClose();
		setOpenDialog((prevOpenDialog) => ({
			...prevOpenDialog,
			search: !prevOpenDialog.search,
		}));
	};

	// List items
	const items = [
		{
			link: true,
			target: `/user/${user.id}`,
			text: "profile",
		},
		{
			link: false,
			target: handleSearchDialog,
			text: "search",
		},
		{
			link: false,
			target: handleNotificationDialog,
			text: "notifications",
		},
		{
			link: true,
			target: "/logout",
			text: "logout",
		},
	];

	return (
		<>
			<Tooltip title={t("more")}>
				<IconButton edge="end" onClick={handleClick} {...props}>
					<MoreVertIcon />
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={avatarAnchor}
				keepMounted
				onClose={handleClose}
				open={Boolean(avatarAnchor)}
			>
				{items.map((item) =>
					item.link ? (
						<Link
							color="inherit"
							href={item.target}
							key={item.text}
							underline="none"
						>
							<MenuItem onClick={handleClose}>{t(item.text)}</MenuItem>
						</Link>
					) : (
						<MenuItem key={item.text} onClick={item.target}>
							{t(item.text)}
						</MenuItem>
					)
				)}
			</Menu>
			<SearchDialog
				onClose={handleSearchDialog}
				open={openDialog.search}
				placeholder={t("search-anything")}
				redirect
				title={t("search")}
			/>
			<NotificationDialog
				onClose={handleNotificationDialog}
				open={openDialog.notification}
				title={t("notifications")}
			/>
		</>
	);
}

export default MoreButton;
