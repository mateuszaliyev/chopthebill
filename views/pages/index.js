// React & Next
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Material UI
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

// Components
import CookieConsent from "../components/CookieConsent";
import HomeDesktop from "../components/landing-page/HomeDesktop";
import HomeMobile from "../components/landing-page/HomeMobile";
import Meta from "../components/Meta";

// Hooks
import useWindowSize from "../components/hooks/useWindowSize";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "landing-page"])),
		},
	};
}

function Home() {
	const { t } = useTranslation("common");
	const { height, width } = useWindowSize();

	const theme = useTheme();
	const bpmd = useMediaQuery(theme.breakpoints.up("md"));

	const desktop = bpmd && width / height >= 1;

	return (
		<>
			<Head>
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<Meta title={t("meta-title")} />
			{desktop ? <HomeDesktop /> : <HomeMobile />}
			<CookieConsent />
		</>
	);
}

export default Home;
