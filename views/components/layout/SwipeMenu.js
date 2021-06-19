// React & Next
import { useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	SwipeableDrawer,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";

// Components
import Link from "../Link";
import Logo from "../Logo";

// iOS Support
const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

// Styles
const useStyles = makeStyles((theme) => ({
	list: {
		width: "16rem",
	},
	logo: {
		alignItems: "center",
		display: "flex",
		padding: "0.5rem 0.25rem",
	},
	logoText: {
		marginLeft: "1rem",
	},
}));

function SwipeMenu({ items }) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const classes = useStyles();

	const toggleSideMenu = (open) => (e) => {
		if (e && e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
			return;
		}

		setOpen(open);
	};

	return (
		<>
			<IconButton
				aria-label="menu"
				color="inherit"
				edge="start"
				onClick={toggleSideMenu(true)}
			>
				<MenuIcon />
			</IconButton>
			<SwipeableDrawer
				anchor="left"
				disableBackdropTransition={!iOS}
				disableDiscovery={iOS}
				open={open}
				onClose={toggleSideMenu(false)}
				onOpen={toggleSideMenu(true)}
			>
				<div className={classes.logo}>
					<Logo background size={48} />
					<Typography
						className={classes.logoText}
						style={{ cursor: "default" }}
						variant="h5"
					>
						ChopTheBill
					</Typography>
				</div>
				<Divider variant="middle" />
				<List
					className={classes.list}
					onClick={toggleSideMenu(false)}
					onKeyDown={toggleSideMenu(false)}
				>
					{items.map((item) => (
						<Link
							color="inherit"
							href={item.href}
							key={item.text}
							underline="none"
						>
							<ListItem button>
								<ListItemIcon>{item.icon}</ListItemIcon>
								<ListItemText primary={t(item.text)} />
							</ListItem>
						</Link>
					))}
				</List>
			</SwipeableDrawer>
		</>
	);
}

export default SwipeMenu;
