import { useEffect, useState } from "react";

function useWindowSize() {
	const [size, setSize] = useState({ height: 0, width: 0 });

	useEffect(() => {
		function updateSize() {
			setSize({ height: window.innerHeight, width: window.innerWidth });
		}

		window.addEventListener("resize", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	return size;
}

export default useWindowSize;
