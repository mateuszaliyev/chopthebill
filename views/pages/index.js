import { useEffect } from "react";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"])),
		},
	};
}

export default function Home({ data }) {
	const { t } = useTranslation("common");

	return (
		<>
			<h1>Hello world</h1>
		</>
	);
}
