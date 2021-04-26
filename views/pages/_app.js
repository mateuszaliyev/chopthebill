// React & Next
import Head from "next/head";
import { appWithTranslation } from "next-i18next";

// Styles
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<link rel="apple-touch-icon" href="/icons/icon-96x96.png"></link>
				<link rel="manifest" href="/manifest.json" />
				<link
					href="/icons/icon-16x16.png"
					rel="icon"
					type="image/png"
					sizes="16x16"
				/>
				<link
					href="/icons/icon-32x32.png"
					rel="icon"
					type="image/png"
					sizes="32x32"
				/>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="description" content="Description" />
				<meta name="keywords" content="Keywords" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="theme-color" content="#4ba0a5" />
				<title>ChopTheBill</title>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default appWithTranslation(MyApp);
