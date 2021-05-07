// React & Next
import { useContext } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { IconButton, Tooltip } from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";

// Context
import { ThemeContext } from "./Theme";

function PaletteButton() {
	const { t } = useTranslation("common");
	const { palette, togglePalette } = useContext(ThemeContext);

	return (
		<Tooltip title={t("palette")}>
			<IconButton color="inherit" onClick={() => togglePalette()}>
				{palette === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
			</IconButton>
		</Tooltip>
	);
}

export default PaletteButton;
