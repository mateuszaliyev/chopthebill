// React & Next
import { useContext, useEffect } from "react";

// Material UI
import { IconButton } from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";

// Context
import { ThemeContext } from "./Theme";

function PaletteButton() {
	const { light, toggleTheme } = useContext(ThemeContext);

	return (
		<IconButton onClick={() => toggleTheme()}>
			{light ? <Brightness4Icon /> : <Brightness7Icon />}
		</IconButton>
	);
}

export default PaletteButton;
