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
		changeTheme(theme);
	}, [light]);

	const changeTheme = (themeName) => {
		setTheme(themeName);
		switch (themeName) {
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
			<ThemeContext.Provider value={{ changeTheme, light, toggleTheme }}>
				<ThemeProvider theme={muiTheme}>
					<CssBaseline />
					{props.children}
				</ThemeProvider>
			</ThemeContext.Provider>
		</>
	);
}

export default Theme;
