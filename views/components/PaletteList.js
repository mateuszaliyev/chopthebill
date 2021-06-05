// React & Next
import { useContext, useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { Button, IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PaletteIcon from "@material-ui/icons/Palette";

// Contexts
import { ThemeContext } from "./Theme";

function PaletteList({ expand, size }) {
	const { t } = useTranslation("common");

	const { theme, setTheme } = useContext(ThemeContext);
	const [paletteAnchor, setPaletteAnchor] = useState(null);

	const handleClick = (event) => {
		setPaletteAnchor(event.currentTarget);
	};

	const handleClose = () => {
		setPaletteAnchor(null);
	};

	return (
		<>
			{expand ? (
				<Tooltip title={t("theme")}>
					<Button
						aria-controls="simple-menu"
						aria-haspopup="true"
						color="inherit"
						endIcon={<ExpandMoreIcon />}
						startIcon={<PaletteIcon />}
						onClick={handleClick}
					>
						{t(theme)}
					</Button>
				</Tooltip>
			) : (
				<Tooltip title={t("theme")}>
					<IconButton
						aria-controls="simple-menu"
						aria-haspopup="true"
						color="inherit"
						onClick={handleClick}
						size={size}
					>
						<PaletteIcon />
					</IconButton>
				</Tooltip>
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
