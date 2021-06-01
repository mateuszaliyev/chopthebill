// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core";

// Components
import Avatar from "../Avatar";
import Link from "../Link";

// Context
import { UserContext } from "../auth/User";

function AvatarButton() {
	const { t } = useTranslation("common");
	const [avatarAnchor, setAvatarAnchor] = useState(null);
	const { user } = useContext(UserContext);

	const handleClick = (e) => {
		setAvatarAnchor(e.currentTarget);
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
				<IconButton color="inherit" edge="end" onClick={handleClick}>
					<Avatar user={user} />
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={avatarAnchor}
				keepMounted
				onClose={handleClose}
				open={Boolean(avatarAnchor)}
			>
				{items.map((item) => (
					<Link
						color="inherit"
						href={item.href}
						key={item.text}
						underline="none"
					>
						<MenuItem onClick={handleClose}>{t(item.text)}</MenuItem>
					</Link>
				))}
			</Menu>
		</>
	);
}

export default AvatarButton;
