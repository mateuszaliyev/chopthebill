// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { Button, Menu, MenuItem } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PaletteIcon from "@material-ui/icons/Palette";

// Context
import { ThemeContext } from "./Theme";

function PaletteList() {
	const { changeTheme } = useContext(ThemeContext);
	const [paletteAnchor, setPaletteAnchor] = useState(null);
	const { t } = useTranslation("common");

	const handleClick = (event) => {
		setPaletteAnchor(event.currentTarget);
	};

	const handleClose = () => {
		setPaletteAnchor(null);
	};

	return (
		<>
			<Button
				aria-controls="simple-menu"
				aria-haspopup="true"
				endIcon={<ExpandMoreIcon />}
				startIcon={<PaletteIcon />}
				onClick={handleClick}
			>
				{t("theme")}
			</Button>
			<Menu
				id="simple-menu"
				anchorEl={paletteAnchor}
				keepMounted
				open={Boolean(paletteAnchor)}
				onClose={handleClose}
			>
				<MenuItem
					onClick={() => {
						changeTheme("default");
						handleClose();
					}}
				>
					{t("default")}
				</MenuItem>
				<MenuItem
					onClick={() => {
						changeTheme("alternative");
						handleClose();
					}}
				>
					{t("alternative")}
				</MenuItem>
			</Menu>
		</>
	);
}

export default PaletteList;
