import { teal } from "@material-ui/core/colors";

const grey = {
	50: "#f8f9fa",
	100: "#e9ecef",
	200: "#dee2e6",
	300: "#ced4da",
	400: "#adb5bd",
	500: "#8c959d",
	600: "#6c757d",
	700: "#495057",
	800: "#343a40",
	900: "#212529",
};

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
		grey,
		primary: teal,
		secondary: brightPalette,
	},
};

export const darkTheme = {
	palette: {
		background: {
			default: grey[900],
			paper: grey[800],
		},
		grey,
		type: "dark",
	},
	typography,
};

export const defaultTheme = {
	palette: {
		grey,
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
		background: {
			default: grey[50],
			paper: "#fff",
		},
		grey,
		type: "light",
	},
	typography,
};
