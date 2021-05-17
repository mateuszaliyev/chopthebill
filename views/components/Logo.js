// React & Next
import Image from "next/image";

// Material UI
import { makeStyles, useTheme } from "@material-ui/core/styles";

// Styles
const useStyles = makeStyles((theme) => ({
	logo: ({ background, center, size }) => ({
		background: background
			? 'url("/icons/icon.svg")'
			: 'url("/icons/icon-no-bg.svg")',
		backgroundPosition: "50% 50%",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		height: size,
		margin: center ? "0 auto" : "",
		width: size,
	}),
}));

function Logo({
	background = false,
	className,
	center = false,
	size = "4rem",
}) {
	const classes = useStyles({ background, center, size });

	return <div className={`${className} ${classes.logo}`} />;
}

export default Logo;
