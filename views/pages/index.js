// React & Next
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Material UI
import { Button } from "@material-ui/core";

// Components
import Language from "../components/Language";
import Meta from "../components/Meta";
import PaletteButton from "../components/PaletteButton";
import PaletteList from "../components/PaletteList";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"])),
		},
	};
}

function Home() {
	const { t } = useTranslation("common");

	return (
		<>
			<Meta title={t("meta-title")} />
			<Language />
			<PaletteButton />
			<PaletteList />
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

export default Home;
