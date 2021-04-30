// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Button,
	IconButton,
	Menu,
	MenuItem,
	useMediaQuery,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PaletteIcon from "@material-ui/icons/Palette";

// Context
import { ThemeContext } from "./Theme";

function PaletteList() {
	const { t } = useTranslation("common");

	const { muiTheme, setTheme } = useContext(ThemeContext);
	const [paletteAnchor, setPaletteAnchor] = useState(null);

	const matches = useMediaQuery(muiTheme.breakpoints.up("sm"));

	const handleClick = (event) => {
		setPaletteAnchor(event.currentTarget);
	};

	const handleClose = () => {
		setPaletteAnchor(null);
	};

	return (
		<>
			{matches ? (
				<Button
					aria-controls="simple-menu"
					aria-haspopup="true"
					color="inherit"
					endIcon={<ExpandMoreIcon />}
					startIcon={<PaletteIcon />}
					onClick={handleClick}
				>
					{t("theme")}
				</Button>
			) : (
				<IconButton
					aria-controls="simple-menu"
					aria-haspopup="true"
					color="inherit"
					onClick={handleClick}
				>
					<PaletteIcon />
				</IconButton>
			)}
			<Menu
				id="simple-menu"
				anchorEl={paletteAnchor}
				keepMounted
				open={Boolean(paletteAnchor)}
				onClose={handleClose}
			>
				<MenuItem
					onClick={() => {
						setTheme("default");
						handleClose();
					}}
				>
					{t("default")}
				</MenuItem>
				<MenuItem
					onClick={() => {
						setTheme("alternative");
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
