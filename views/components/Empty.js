// Material UI
import { useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// Styles
const useStyles = makeStyles((theme) => ({
	logo: ({ bpsm }) => ({
		background: 'url("/icons/icon-no-bg.svg")',
		backgroundPosition: "50% 50%",
		backgroundRepeat: "no-repeat",
		backgroundSize: bpsm ? "48rem" : "24rem",
		filter: `invert(1)`,
		height: "100%",
		opacity: "0.05",
	}),
}));

function Empty() {
	const theme = useTheme();
	const bpsm = useMediaQuery(theme.breakpoints.up("sm"));
	const classes = useStyles({ bpsm });

	return <div className={classes.logo} />;
}

export default Empty;
