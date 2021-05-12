// React & Next
import Image from "next/image";

// Material UI
import { makeStyles, useTheme } from "@material-ui/core/styles";

// Styles
const useStyles = makeStyles((theme) => ({
	logo: ({ center, size }) => ({
		background: 'url("/icons/icon.svg")',
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		height: size,
		margin: center ? "0 auto" : "",
		width: size,
	}),
}));

function Logo({ center = false, size = "4rem" }) {
	const classes = useStyles({ center, size });

	return (
		<div className={classes.logo} />
		// <Image
		// 	alt="ChopTheBill logo"
		// 	height={size || 64}
		// 	src="/icons/icon.svg"
		// 	width={size || 64}
		// />
	);
}

export default Logo;
