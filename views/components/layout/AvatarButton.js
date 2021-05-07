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

// Hooks
import useTextToColor from "../hooks/useTextToColor";

function AvatarButton({ items }) {
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
			<Tooltip title={user.username}>
				<IconButton color="inherit" onClick={handleClick}>
					<Avatar
						alt={user.username}
						color={color}
						src={`${host}/avatars/${user.id}.png`}
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
						<Link color="inherit" href={item.href}>
							{t(item.text)}
						</Link>
					</MenuItem>
				))}
			</Menu>
		</>
	);
}

export default AvatarButton;