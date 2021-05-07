// React & Next
import Image from "next/image";

function Logo({ size }) {
	return (
		<Image
			alt="ChopTheBill logo"
			height={size || 64}
			src="/icons/icon.svg"
			width={size || 64}
		/>
	);
}

export default Logo;
