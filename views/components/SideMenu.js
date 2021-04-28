// React & Next
import { useState } from "react";

// Material UI
import { Button, SwipeableDrawer } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

// Components
import SideMenuList from "./SideMenuList";

// iOS Support
const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

function SideMenu() {
	const [open, setOpen] = useState(false);

	const toggleSideMenu = (open) => (e) => {
		if (e && e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
			return;
		}

		setOpen(open);
	};

	return (
		<>
			<Button onClick={toggleSideMenu(true)}>
				<MenuIcon />
			</Button>
			<SwipeableDrawer
				anchor="left"
				disableBackdropTransition={!iOS}
				disableDiscovery={iOS}
				open={open}
				onClose={toggleSideMenu(false)}
				onOpen={toggleSideMenu(true)}
			>
				<SideMenuList toggleSideMenu={toggleSideMenu} />
			</SwipeableDrawer>
		</>
	);
}

export default SideMenu;
