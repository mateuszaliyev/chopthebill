// React & Next
import { useEffect, useState } from "react";

// Material UI
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Styles
const useStyles = makeStyles((theme) => ({
	loader: {
		display: "grid",
		height: "100%",
		placeItems: "center",
		width: "100%",
	},
}));

function Loader({ size }) {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setTimeout(setLoading(true), 1000);
	});

	return (
		<div className={classes.loader}>
			{loading && <CircularProgress color="primary" size={size} />}
		</div>
	);
}

export default Loader;
