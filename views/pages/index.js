// React & Next
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Material UI
import { Button } from "@material-ui/core";

// Components
import Language from "../components/Language";

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
			<Language />
			<Link href="/login">
				<Button color="primary" variant="outlined">
					{t("login")}
				</Button>
			</Link>
			<Link href="/register">
				<Button color="primary" variant="contained">
					{t("register")}
				</Button>
			</Link>
		</>
	);
}
