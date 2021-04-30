// React & Next
import { useEffect, useState, createContext } from "react";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import PropTypes from "prop-types";

// Components
import Theme from "../components/Theme";

// Styles
import "../styles/globals.scss";

// Contexts
export const JWTContext = createContext();

function MyApp({ Component, pageProps }) {
	const [accessToken, setAccessToken] = useState("");
	const [refreshToken, setRefreshToken] = useState("");

	useEffect(() => {
		const jssStyles = document.querySelector("#jss-server-side");
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, []);

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
				<meta name="theme-color" content="#009688" />
				<title>ChopTheBill</title>
			</Head>
			<Theme>
				<JWTContext.Provider
					value={{ accessToken, setAccessToken, refreshToken, setRefreshToken }}
				>
					<Component {...pageProps} />
				</JWTContext.Provider>
			</Theme>
		</>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};

export default appWithTranslation(MyApp);
