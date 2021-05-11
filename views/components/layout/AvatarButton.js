// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core";

// Components
import Avatar from "../Avatar";
import Link from "../Link";

// Config
import { host } from "../../config";

// Context
import { UserContext } from "../auth/User";

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

	// List items
	const items = [
		{
			href: `/user/${user.id}`,
			text: "profile",
		},
		{
			href: "/logout",
			text: "logout",
		},
	];

	return (
		<>
			<Tooltip title={user.username}>
				<IconButton color="inherit" onClick={handleClick}>
					<Avatar
						alt={user.username} /* src={`${host}/avatars/${user.id}.png`} */
					/>
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={avatarAnchor}
				keepMounted
				open={Boolean(avatarAnchor)}
				onClose={handleClose}
			>
				{items.map((item) => (
					<MenuItem key={item.text} onClick={handleClose}>
						<Link color="inherit" href={item.href} underline="none">
							{t(item.text)}
						</Link>
					</MenuItem>
				))}
			</Menu>
		</>
	);
}

export default AvatarButton;
