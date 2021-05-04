// React & Next
import { useState, useContext } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { Avatar, IconButton, Menu, MenuItem } from "@material-ui/core";

// Components
import Link from "./Link";

// Config
import { host } from "../config";

// Context
import { UserContext } from "./auth/User";

function AvatarButton() {
	const { t } = useTranslation("common");
	const [avatarAnchor, setAvatarAnchor] = useState(null);
	const { user } = useContext(UserContext);

	const handleClick = (event) => {
		setAvatarAnchor(event.currentTarget);
	};

	const handleClose = () => {
		setAvatarAnchor(null);
	};

	return (
		<>
			<IconButton color="inherit" onClick={handleClick}>
				<Avatar
					alt={user.username.toUpperCase()}
					src={`${host}/avatars/${user.id}.png`}
				/>
			</IconButton>
			<Menu
				id="simple-menu"
				anchorEl={avatarAnchor}
				keepMounted
				open={Boolean(avatarAnchor)}
				onClose={handleClose}
			>
				<MenuItem onClick={handleClose}>
					<Link color="inherit" href="/account">
						{t("profile")}
					</Link>
				</MenuItem>
				<MenuItem onClick={handleClose}>
					<Link color="inherit" href="/logout">
						{t("logout")}
					</Link>
				</MenuItem>
			</Menu>
		</>
	);
}

export default AvatarButton;
