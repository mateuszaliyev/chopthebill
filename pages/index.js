import { useEffect } from "react";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { host } from "../config";

export async function getServerSideProps({ locale }) {
	const res = await fetch(`${host}/hello`);
	const data = await res.json();
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"])),
			data,
		},
	};
}

export default function Home({ data }) {
	const { t } = useTranslation("common");

	return (
		<>
			<h1>{data.message}</h1>
			<h2>{t("hello-world")}</h2>
		</>
	);
}
