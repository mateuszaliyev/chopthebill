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
import { JWTContext } from "../pages/_app";

function AvatarButton() {
	const { t } = useTranslation("common");
	const [avatarAnchor, setAvatarAnchor] = useState(null);
	const { accessToken, setAccessToken } = useContext(JWTContext);

	const logout = async () => {
		const res = await fetch(`${host}/logout`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		console.log(res.status);
		if (res.ok) {
			setAccessToken("");
		}
	};

	const handleClick = (event) => {
		setAvatarAnchor(event.currentTarget);
	};

	const handleClose = () => {
		setAvatarAnchor(null);
	};

	return (
		<>
			<IconButton color="inherit" onClick={handleClick}>
				<Avatar alt="Username" src={`${host}/avatars/7.png`} />
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
				<MenuItem
					onClick={() => {
						logout();
						handleClose();
					}}
				>
					{t("logout")}
				</MenuItem>
			</Menu>
		</>
	);
}

export default AvatarButton;
