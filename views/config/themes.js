import { green, teal } from "@material-ui/core/colors";

const typography = {
	fontFamily: '"Quicksand", "Helvetica", "Arial", "sans-serif"',
	fontWeightLight: 400,
	fontWeightRegular: 500,
	fontWeightMedium: 600,
	fontWeightBold: 700,
};

export const alternativeTheme = {
	palette: {
		primary: green,
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
		primary: teal,
	},
};

export const lightTheme = {
	palette: {
		type: "light",
	},
	typography,
};
