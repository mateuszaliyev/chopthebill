import { grey, teal } from "@material-ui/core/colors";

// const errorPalette = {
// 	light: "#e57373",
// 	main: "#f44336",
// 	dark: "#d32f2f",
// 	contrastText: "#fff",
// };

const brightPalette = {
	light: grey[50],
	main: grey[100],
	dark: grey[150],
};

const typography = {
	fontFamily: '"Quicksand", "Helvetica", "Arial", "sans-serif"',
	fontWeightLight: 400,
	fontWeightRegular: 500,
	fontWeightMedium: 600,
	fontWeightBold: 700,
};

export const alternativeTheme = {
	palette: {
		primary: teal,
		secondary: brightPalette,
	},
};

export const darkTheme = {
	palette: {
		type: "dark",
	},
	typography,
};

export const defaultTheme = {
	palette: {
		primary: {
			contrastText: "#fff",
			dark: "#1a714b",
			light: "#51b589",
			main: "#26a26c",
		},
		secondary: brightPalette,
	},
};

export const lightTheme = {
	palette: {
		type: "light",
	},
	typography,
};
