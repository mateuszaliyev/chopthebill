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
	const [light, setLight] = useState(true);
	const [theme, setTheme] = useState("default");
	const [muiTheme, setMuiTheme] = useState(
		createMuiTheme(merge(defaultTheme, lightTheme))
	);

	useEffect(() => {
		const localLight = localStorage.getItem("light");
		const localTheme = localStorage.getItem("theme");
		if (localLight) {
			if (localLight === "true") {
				setLight(true);
			}
			if (localLight === "false") {
				setLight(false);
			}
		}
		if (localTheme) {
			setTheme(localTheme);
		}
	}, []);

	useEffect(() => {
		changeTheme(theme);
	}, [light, theme]);

	const changeTheme = () => {
		switch (theme) {
			case "alternative":
				setMuiTheme(
					createMuiTheme(
						merge(alternativeTheme, light ? lightTheme : darkTheme)
					)
				);
				break;
			default:
				setMuiTheme(
					createMuiTheme(merge(defaultTheme, light ? lightTheme : darkTheme))
				);
				break;
		}

		localStorage.setItem("light", `${light}`);
		localStorage.setItem("theme", theme);
	};

	const toggleTheme = () => {
		setLight((prevLight) => !prevLight);
	};

	return (
		<>
			<Head>
				<meta
					name="theme-color"
					content={muiTheme?.palette?.primary?.main ?? "#009688"}
				/>
			</Head>
			<ThemeContext.Provider value={{ light, muiTheme, setTheme, toggleTheme }}>
				<ThemeProvider theme={muiTheme}>
					<CssBaseline />
					{props.children}
				</ThemeProvider>
			</ThemeContext.Provider>
		</>
	);
}

export default Theme;
