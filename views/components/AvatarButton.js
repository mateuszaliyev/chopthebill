// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { IconButton, Menu, MenuItem } from "@material-ui/core";

// Components
import Avatar from "./Avatar";
import Link from "./Link";

// Config
import { host } from "../config";

// Context
import { UserContext } from "./auth/User";

// Hooks
import useTextToColor from "./hooks/useTextToColor";

function AvatarButton() {
	const { t } = useTranslation("common");
	const [avatarAnchor, setAvatarAnchor] = useState(null);
	const { user } = useContext(UserContext);

	const color = useTextToColor(user.username);

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
					alt={user.username}
					color={color}
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
