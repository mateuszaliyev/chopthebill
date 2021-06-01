// Material UI
import { makeStyles } from "@material-ui/core/styles";

// Hooks
import useWindowSize from "./hooks/useWindowSize";

// Styles
const useStyles = makeStyles((theme) => ({
	logo: ({ height, width }) => ({
		background: 'url("/icons/icon-no-bg.svg")',
		backgroundPosition: "50% 50%",
		backgroundRepeat: "no-repeat",
		backgroundSize: height > width ? `${width - 64}px` : `${height - 64}px`,
		filter: `invert(1)`,
		height: "100%",
		opacity: "0.05",
	}),
}));

function Empty() {
	const { height, width } = useWindowSize();
	const classes = useStyles({ height, width });

	return <div className={classes.logo} />;
}

export default Empty;
