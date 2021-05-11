// React & Next
import { useContext } from "react";

// Material UI
import { useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// Contexts
import { ThemeContext } from "../components/Theme";

const useStyles = makeStyles((theme) => ({
	logo: ({ bpsm, palette }) => ({
		background: 'url("/icons/icon-no-bg.svg")',
		backgroundPosition: "50% 50%",
		backgroundRepeat: "no-repeat",
		backgroundSize: bpsm ? "48rem" : "24rem",
		filter: `invert(${palette === "light" ? 1 : 0})`,
		height: "100%",
		opacity: "0.05",
	}),
}));

function Empty() {
	const theme = useTheme();
	const bpsm = useMediaQuery(theme.breakpoints.up("sm"));
	const { palette } = useContext(ThemeContext);
	const classes = useStyles({ bpsm, palette });

	return <div className={classes.logo} />;
}

export default Empty;
