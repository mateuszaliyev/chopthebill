// Material UI
import {
	amber,
	blue,
	// blueGrey,
	brown,
	cyan,
	deepOrange,
	deepPurple,
	green,
	// grey,
	indigo,
	lightBlue,
	lightGreen,
	lime,
	orange,
	pink,
	purple,
	red,
	teal,
	yellow,
} from "@material-ui/core/colors";

const colors = [
	amber,
	blue,
	// blueGrey,
	brown,
	cyan,
	deepOrange,
	deepPurple,
	green,
	// grey,
	indigo,
	lightBlue,
	lightGreen,
	lime,
	orange,
	pink,
	purple,
	red,
	teal,
	yellow,
];

function useTextToColor(text = "default") {
	const textArray = text.split("");
	const value = textArray.reduce(
		(sum, letter) => sum + letter.charCodeAt(0),
		0
	);
	const color = colors[value % colors.length];
	return color[500];
}

export default useTextToColor;
