// React & Next
import { useContext } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { IconButton, Tooltip } from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";

// Contexts
import { ThemeContext } from "./Theme";

function PaletteButton({ size }) {
	const { t } = useTranslation();
	const { palette, togglePalette } = useContext(ThemeContext);

	return (
		<Tooltip title={t("toggle-palette")}>
			<IconButton color="inherit" onClick={() => togglePalette()} size={size}>
				{palette === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
			</IconButton>
		</Tooltip>
	);
}

export default PaletteButton;
