// React & Next
import { createContext, useEffect, useState } from "react";
import Head from "next/head";

// Material UI
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

// Themes
import {
	alternativeTheme,
	darkTheme,
	defaultTheme,
	lightTheme,
} from "../config/themes";

// Lodash
import merge from "lodash/merge";

// Contexts
export const ThemeContext = createContext();

function Theme(props) {
	const [palette, setPalette] = useState("light");
	const [theme, setTheme] = useState("default");
	const [muiTheme, setMuiTheme] = useState(
		createMuiTheme(merge(defaultTheme, lightTheme))
	);

	const changeTheme = () => {
		switch (theme) {
			case "alternative":
				setMuiTheme(
					createMuiTheme(
						merge(alternativeTheme, palette === "dark" ? darkTheme : lightTheme)
					)
				);
				break;
			default:
				setMuiTheme(
					createMuiTheme(
						merge(defaultTheme, palette === "dark" ? darkTheme : lightTheme)
					)
				);
				break;
		}

		localStorage.setItem("theme", `${theme}-${palette}`);
	};

	const togglePalette = () => {
		setPalette((prevPalette) => (prevPalette === "light" ? "dark" : "light"));
	};

	useEffect(() => {
		if (localStorage.getItem("theme")) {
			const localPalette = localStorage.getItem("theme").split("-")[1];
			const localTheme = localStorage.getItem("theme").split("-")[0];
			if (localPalette === "light" || localPalette === "dark") {
				setPalette(localPalette);
			} else {
				setPalette("light");
			}
			if (localTheme) {
				setTheme(localTheme);
			}
		}
	}, []);

	useEffect(changeTheme, [palette, theme]);

	return (
		<>
			<Head>
				<meta
					name="theme-color"
					content={muiTheme?.palette?.primary?.main ?? "#009688"}
				/>
			</Head>
			<ThemeContext.Provider
				value={{
					muiTheme,
					palette,
					setPalette,
					setTheme,
					theme,
					togglePalette,
				}}
			>
				<ThemeProvider theme={muiTheme}>
					<CssBaseline />
					{props.children}
				</ThemeProvider>
			</ThemeContext.Provider>
		</>
	);
}

export default Theme;
