// React & Next
import { useEffect, useState } from "react";

// Material UI
import { CircularProgress } from "@material-ui/core";

function Loader() {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setTimeout(setLoading(true), 1000);
	});

	return <div className="center">{loading && <CircularProgress />}</div>;
}

export default Loader;
